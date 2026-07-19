import apiClient, { authHeaders } from './api';

export const interviewService = {
  generateInterview: (payload, token) => {
    const config = token ? { headers: authHeaders(token) } : {};
    return apiClient.post('/ai/interview-prep', payload, config);
  }
};

export default interviewService;
