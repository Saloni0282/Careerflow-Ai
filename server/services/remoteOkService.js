import axios from 'axios';

const REMOTE_OK_API_URL = process.env.REMOTEOK_API_URL || 'https://remoteok.com/api';
const REMOTE_OK_TIMEOUT = 10000;

// const normalizeRemoteOkJob = (remoteJob) => ({
//   _id: `remoteok-${remoteJob.id}`,
//   id: String(remoteJob.id || ''),
//   title: remoteJob.position || remoteJob.title || 'Unknown Role',
//   company: remoteJob.company || remoteJob.company_name || 'Unknown Company',
//   logo: remoteJob.logo || remoteJob.company_logo || '',
//   location: remoteJob.location || (remoteJob.remote ? 'Remote' : 'Remote'),
//   salary: remoteJob.salary || remoteJob.payment || 'Not specified',
//   tags: Array.isArray(remoteJob.tags) ? remoteJob.tags : [],
//   skills: Array.isArray(remoteJob.tags) ? remoteJob.tags : [],
//   description: remoteJob.description || remoteJob.about || '',
//   applyLink: remoteJob.url || remoteJob.apply_url || '',
//   postedDate: remoteJob.date ? new Date(remoteJob.date) : new Date(),
//   workMode: remoteJob.remote ? 'Remote' : 'Onsite',
//   experienceLevel: remoteJob.level || 'Not specified',
//   employmentType: remoteJob.job_type || remoteJob.type || 'Not specified',
//   category: Array.isArray(remoteJob.tags) && remoteJob.tags.length > 0 ? remoteJob.tags[0] : 'Other'
// });

// export const fetchRemoteOkJobs = async () => {
//   try {
//     const response = await axios.get(REMOTE_OK_API_URL, {
//       timeout: REMOTE_OK_TIMEOUT,
//       headers: {
//         'User-Agent': 'CareerFlowAI/1.0 (+https://remoteok.com)'
//       }
//     });

//     const data = response.data;
//     if (!Array.isArray(data) || data.length === 0) {
//       return [];
//     }

//     const jobs = data.slice(1);
//     return jobs
//       .filter((job) => job && job.id && (job.company || job.company_name))
//       .map(normalizeRemoteOkJob);
//   } catch (error) {
//     console.error('[RemoteOK] fetch failed:', error?.message || error);
//     throw new Error('RemoteOK fetch failed');
//   }
// };

// export const getRemoteJobById = async (id) => {
//   if (!id) {
//     return null;
//   }

//   try {
//     const allJobs = await fetchRemoteOkJobs();
//     return allJobs.find((job) => job._id === id) || null;
//   } catch (error) {
//     console.error('[RemoteOK] getRemoteJobById failed:', error?.message || error);
//     return null;
//   }
// };
