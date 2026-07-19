import apiClient, { authHeaders } from './api';

export const atsService = {
  analyzeResume: (formData, token) => {
    const config = token ? { headers: authHeaders(token) } : {};
    return apiClient.post('/ai/ats-checker', formData, config);
  }
};
