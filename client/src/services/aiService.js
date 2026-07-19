import apiClient from './api';

export const aiService = {
  generateCoverLetter: ({ jobDescription, resumePdf }) => {
    const formData = new FormData();
    formData.append('jobDescription', jobDescription);

    if (resumePdf) {
      formData.append('resumePdf', resumePdf);
    }

    return apiClient.post('/ai/cover-letter', formData);
  }
};
