import Job from '../models/Job.js';
import * as remoteOkService from './remoteOkService.js';
import seedJobs, { jobs as seedJobsData } from '../data/seedJobs.js';

const ensureSeedJobs = async () => {
  try {
    const count = await Job.countDocuments();
    if (count === 0) {
      await seedJobs();
      return true;
    }
  } catch (error) {
    console.error('[JobService] ensureSeedJobs failed:', error?.message || error);
  }
  return false;
};

export const getAllJobs = async () => {
  try {
    const remoteJobs = await remoteOkService.fetchRemoteOkJobs();
    if (Array.isArray(remoteJobs) && remoteJobs.length > 0) return remoteJobs;
    // fall through to DB if remote returned empty
  } catch (remoteError) {
    console.error('[JobService] RemoteOK getAllJobs failed, using local DB fallback:', remoteError?.message || remoteError);
  }

  // Try DB next
  try {
    const dbJobs = await Job.find({ createdBy: { $exists: false } }).sort({ postedDate: -1 });
    if (Array.isArray(dbJobs) && dbJobs.length > 0) return dbJobs;
    const seeded = await ensureSeedJobs();
    if (seeded) {
      return Job.find({ createdBy: { $exists: false } }).sort({ postedDate: -1 });
    }
  } catch (dbErr) {
    console.error('[JobService] DB fallback failed:', dbErr?.message || dbErr);
  }

  // Finally, fall back to seeded jobs (in-memory)
  console.warn('[JobService] Falling back to seeded jobs');
  return seedJobsData;
}


export const getJobsPaginated = async ({ page = 1, limit = 10, search = '', filters = {} }) => {
  const start = (page - 1) * limit;

  try {
    const remoteJobs = await remoteOkService.fetchRemoteOkJobs();

    const filteredRemoteJobs = remoteJobs.filter((job) => {
      const matchesSearch = search
        ? [job.title, job.company, job.description, ...(job.skills || [])]
            .join(' ')
            .toLowerCase()
            .includes(search.toLowerCase())
        : true;

      const matchesCategory = filters.category ? job.category === filters.category : true;
      const matchesLocation = filters.location ? job.location === filters.location : true;
      const matchesEmployment = filters.employmentType ? job.employmentType === filters.employmentType : true;
      const matchesExperience = filters.experienceLevel ? job.experienceLevel === filters.experienceLevel : true;

      return matchesSearch && matchesCategory && matchesLocation && matchesEmployment && matchesExperience;
    });

    const pagedRemoteJobs = filteredRemoteJobs.slice(start, start + limit);
    return {
      jobs: pagedRemoteJobs,
      totalJobs: filteredRemoteJobs.length,
      totalPages: Math.max(1, Math.ceil(filteredRemoteJobs.length / limit)),
      currentPage: Number(page)
    };
  } catch (remoteError) {
    console.error('[JobService] RemoteOK integration failed, falling back to local DB query:', remoteError?.message || remoteError);

    const skip = (page - 1) * limit;
    const query = { createdBy: { $exists: false } };

    if (search) {
      const rx = new RegExp(search, 'i');
      query.$or = [{ title: rx }, { company: rx }, { description: rx }, { skills: rx }];
    }

    // apply simple filters (category, location, employmentType, experienceLevel)
    if (filters.category) query.category = filters.category;
    if (filters.location) query.location = filters.location;
    if (filters.employmentType) query.employmentType = filters.employmentType;
    if (filters.experienceLevel) query.experienceLevel = filters.experienceLevel;

    // OLD DB pagination logic preserved for reference/fallback:
    // const skip = (page - 1) * limit;
    // const query = {};
    // if (search) {
    //   const rx = new RegExp(search, 'i');
    //   query.$or = [{ title: rx }, { company: rx }, { description: rx }, { skills: rx }];
    // }
    // if (filters.category) query.category = filters.category;
    // if (filters.location) query.location = filters.location;
    // if (filters.employmentType) query.employmentType = filters.employmentType;
    // if (filters.experienceLevel) query.experienceLevel = filters.experienceLevel;
    // const [totalJobs, jobs] = await Promise.all([
    //   Job.countDocuments(query),
    //   Job.find(query).sort({ postedDate: -1 }).skip(skip).limit(Number(limit))
    // ]);

    let [totalJobs, jobs] = await Promise.all([
      Job.countDocuments(query),
      Job.find(query).sort({ postedDate: -1 }).skip(skip).limit(Number(limit))
    ]);

    if (totalJobs === 0) {
      const seeded = await ensureSeedJobs();
      if (seeded) {
        [totalJobs, jobs] = await Promise.all([
          Job.countDocuments(query),
          Job.find(query).sort({ postedDate: -1 }).skip(skip).limit(Number(limit))
        ]);
      }
    }

    if (totalJobs === 0) {
      // Use seedJobs as final fallback (client-side pagination of seeded array)
      const filtered = seedJobsData.filter((job) => {
        const matchesSearch = search
          ? [job.title, job.company, job.description, ...(job.skills || [])]
              .join(' ')
              .toLowerCase()
              .includes(search.toLowerCase())
          : true;
        const matchesCategory = filters.category ? job.category === filters.category : true;
        const matchesLocation = filters.location ? job.location === filters.location : true;
        const matchesEmployment = filters.employmentType ? job.employmentType === filters.employmentType : true;
        const matchesExperience = filters.experienceLevel ? job.experienceLevel === filters.experienceLevel : true;
        return matchesSearch && matchesCategory && matchesLocation && matchesEmployment && matchesExperience;
      });

      const pagedRemoteJobs = filtered.slice(start, start + limit);
      return {
        jobs: pagedRemoteJobs,
        totalJobs: filtered.length,
        totalPages: Math.max(1, Math.ceil(filtered.length / limit)),
        currentPage: Number(page)
      };
    }

    const totalPages = Math.max(1, Math.ceil(totalJobs / limit));

    return { jobs, totalJobs, totalPages, currentPage: Number(page) };
  }
};

export const getJobById = async (id) => {
  // Use RemoteOK first for remote-sourced jobs, then preserve DB lookup as fallback.
  if (typeof id === 'string' && id.startsWith('remoteok-')) {
    const remoteJob = await remoteOkService.getRemoteJobById(id);
    if (remoteJob) {
      return remoteJob;
    }
  }

  // OLD DB getJobById logic preserved for reference/fallback:
  // return Job.findById(id);
  return Job.findById(id);
};

export const getExternalJobsByUser = async (userId) => {
  return Job.find({ createdBy: userId }).sort({ appliedDate: -1 });
};

export const createJob = async (payload) => {
  return Job.create(payload);
};

export const updateJob = async (jobId, payload, userId) => {
  return Job.findOneAndUpdate({ _id: jobId, createdBy: userId }, payload, { new: true });
};

export const deleteJob = async (jobId, userId) => {
  return Job.findOneAndDelete({ _id: jobId, createdBy: userId });
};
