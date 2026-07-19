import Job from '../models/Job.js';

const jobs = [
  {
    "title": "Frontend Developer",
    "company": "Infosys",
    "location": "Pune",
    "workMode": "Hybrid",
    "experienceLevel": "Entry",
    "employmentType": "Full-time",
    "salary": "5 LPA",
    "source": "LinkedIn",
    "applicationStatus": "Applied",
    "skills": ["React", "JavaScript", "HTML", "CSS"],
    "description": "Develop responsive web applications using React.",
    "notes": "Applied through LinkedIn"
  },
  {
    "title": "Backend Developer",
    "company": "TCS",
    "location": "Bangalore",
    "workMode": "Onsite",
    "experienceLevel": "Entry",
    "employmentType": "Full-time",
    "salary": "6 LPA",
    "source": "Naukri",
    "applicationStatus": "Interview Scheduled",
    "skills": ["Node.js", "Express", "MongoDB"],
    "description": "Build scalable backend APIs.",
    "notes": "HR call scheduled"
  },
  {
    "title": "MERN Stack Developer",
    "company": "Wipro",
    "location": "Hyderabad",
    "workMode": "Hybrid",
    "experienceLevel": "Mid",
    "employmentType": "Full-time",
    "salary": "8 LPA",
    "source": "LinkedIn",
    "applicationStatus": "Applied",
    "skills": ["React", "Node.js", "MongoDB"],
    "description": "Full stack development using MERN stack."
  },
  {
    "title": "Associate Software Engineer",
    "company": "Accenture",
    "location": "Mumbai",
    "workMode": "Hybrid",
    "experienceLevel": "Entry",
    "employmentType": "Full-time",
    "salary": "6.5 LPA",
    "source": "Company Website",
    "applicationStatus": "Rejected",
    "skills": ["JavaScript", "SQL"],
    "description": "Software development and maintenance."
  },
  {
    "title": "Software Engineer",
    "company": "Capgemini",
    "location": "Pune",
    "workMode": "Remote",
    "experienceLevel": "Mid",
    "employmentType": "Full-time",
    "salary": "9 LPA",
    "source": "LinkedIn",
    "applicationStatus": "Offer Received",
    "skills": ["Node.js", "MongoDB", "AWS"],
    "description": "Develop enterprise-grade applications."
  },
  {
    "title": "React Developer",
    "company": "Cognizant",
    "location": "Chennai",
    "workMode": "Hybrid",
    "experienceLevel": "Entry",
    "employmentType": "Full-time",
    "salary": "5.5 LPA",
    "source": "Indeed",
    "applicationStatus": "Applied",
    "skills": ["React", "Redux", "JavaScript"]
  },
  {
    "title": "Node.js Developer",
    "company": "Tech Mahindra",
    "location": "Pune",
    "workMode": "Remote",
    "experienceLevel": "Mid",
    "employmentType": "Full-time",
    "salary": "10 LPA",
    "source": "LinkedIn",
    "applicationStatus": "Interviewing",
    "skills": ["Node.js", "Express", "MongoDB"]
  },
  {
    "title": "Full Stack Developer",
    "company": "HCL Technologies",
    "location": "Noida",
    "workMode": "Hybrid",
    "experienceLevel": "Mid",
    "employmentType": "Full-time",
    "salary": "11 LPA",
    "source": "Naukri",
    "applicationStatus": "Applied",
    "skills": ["React", "Node.js", "MongoDB", "AWS"]
  },
  {
    "title": "JavaScript Developer",
    "company": "LTIMindtree",
    "location": "Pune",
    "workMode": "Remote",
    "experienceLevel": "Entry",
    "employmentType": "Full-time",
    "salary": "6 LPA",
    "source": "LinkedIn",
    "applicationStatus": "Applied",
    "skills": ["JavaScript", "React"]
  },
  {
    "title": "Software Development Engineer",
    "company": "Zoho",
    "location": "Chennai",
    "workMode": "Onsite",
    "experienceLevel": "Entry",
    "employmentType": "Full-time",
    "salary": "8 LPA",
    "source": "Company Website",
    "applicationStatus": "Interview Scheduled",
    "skills": ["JavaScript", "Node.js", "SQL"]
  },
  {
    "title": "Backend Engineer",
    "company": "Razorpay",
    "location": "Bangalore",
    "workMode": "Hybrid",
    "experienceLevel": "Mid",
    "employmentType": "Full-time",
    "salary": "15 LPA",
    "source": "LinkedIn",
    "applicationStatus": "Applied",
    "skills": ["Node.js", "Redis", "MongoDB"]
  },
  {
    "title": "Frontend Engineer",
    "company": "PhonePe",
    "location": "Bangalore",
    "workMode": "Hybrid",
    "experienceLevel": "Mid",
    "employmentType": "Full-time",
    "salary": "14 LPA",
    "source": "LinkedIn",
    "applicationStatus": "Interviewing",
    "skills": ["React", "TypeScript"]
  },
  {
    "title": "Software Engineer I",
    "company": "Paytm",
    "location": "Noida",
    "workMode": "Hybrid",
    "experienceLevel": "Entry",
    "employmentType": "Full-time",
    "salary": "7 LPA",
    "source": "Indeed",
    "applicationStatus": "Applied",
    "skills": ["Node.js", "MongoDB"]
  },
  {
    "title": "MERN Developer",
    "company": "Codelinear",
    "location": "Remote",
    "workMode": "Remote",
    "experienceLevel": "Entry",
    "employmentType": "Full-time",
    "salary": "8 LPA",
    "source": "LinkedIn",
    "applicationStatus": "Applied",
    "skills": ["React", "Node.js", "MongoDB"]
  },
  {
    "title": "Associate Developer",
    "company": "Persistent Systems",
    "location": "Pune",
    "workMode": "Hybrid",
    "experienceLevel": "Entry",
    "employmentType": "Full-time",
    "salary": "6 LPA",
    "source": "Referral",
    "applicationStatus": "Applied",
    "skills": ["JavaScript", "React"]
  },
  {
    "title": "Software Engineer",
    "company": "Nagarro",
    "location": "Remote",
    "workMode": "Remote",
    "experienceLevel": "Mid",
    "employmentType": "Full-time",
    "salary": "12 LPA",
    "source": "LinkedIn",
    "applicationStatus": "Offer Received",
    "skills": ["Node.js", "AWS", "MongoDB"]
  },
  {
    "title": "React Engineer",
    "company": "BrowserStack",
    "location": "Mumbai",
    "workMode": "Remote",
    "experienceLevel": "Mid",
    "employmentType": "Full-time",
    "salary": "16 LPA",
    "source": "LinkedIn",
    "applicationStatus": "Interviewing",
    "skills": ["React", "TypeScript", "Redux"]
  },
  {
    "title": "Full Stack Engineer",
    "company": "Freshworks",
    "location": "Chennai",
    "workMode": "Hybrid",
    "experienceLevel": "Mid",
    "employmentType": "Full-time",
    "salary": "13 LPA",
    "source": "Company Website",
    "applicationStatus": "Applied",
    "skills": ["React", "Node.js", "PostgreSQL"]
  },
  {
    "title": "Associate Software Developer",
    "company": "Oracle",
    "location": "Bangalore",
    "workMode": "Hybrid",
    "experienceLevel": "Entry",
    "employmentType": "Full-time",
    "salary": "9 LPA",
    "source": "LinkedIn",
    "applicationStatus": "Rejected",
    "skills": ["JavaScript", "SQL"]
  },
  {
    "title": "Software Engineer",
    "company": "Adobe",
    "location": "Noida",
    "workMode": "Hybrid",
    "experienceLevel": "Mid",
    "employmentType": "Full-time",
    "salary": "18 LPA",
    "source": "LinkedIn",
    "applicationStatus": "Interview Scheduled",
    "skills": ["React", "Node.js", "AWS", "TypeScript"]
  }
]

const seedJobs = async () => {
  try {
    const jobCount = await Job.countDocuments();
    if (jobCount === 0) {
      await Job.insertMany(jobs);
      console.log('[Seed Jobs] Seeded default jobs');
    }
  } catch (error) {
    console.error('[Seed Jobs] Error seeding jobs:', error);
    return;
  }
};

export default seedJobs;
export { jobs };
