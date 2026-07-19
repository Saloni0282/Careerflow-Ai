import apiClient, { authHeaders } from './api';

export const applicationService = {
  getApplications: (token) => apiClient.get('/applications', { headers: authHeaders(token) }),

  applyForJob: (jobId, token) => apiClient.post('/applications', { jobId }, { headers: authHeaders(token) }),

  updateApplication: (id, payload, token) => apiClient.put(`/applications/${id}`, payload, { headers: authHeaders(token) }),
  
  deleteApplication: (id, token) => apiClient.delete(`/applications/${id}`, { headers: authHeaders(token) })
};
