import apiClient, { authHeaders } from './api';

const authConfig = (token) => ({ headers: authHeaders(token) });

export const jobService = {
  getJobs: (params = {}, token) => apiClient.get('/jobs', { params, headers: authHeaders(token) }),
  getExternalJobs: (token) => apiClient.get('/jobs/external', { headers: authHeaders(token) }),
  getJobById: (id, token) => apiClient.get(`/jobs/${id}`, { headers: authHeaders(token) }),
  createJob: (payload, token) => apiClient.post('/jobs', payload, { headers: authHeaders(token) }),
  updateJob: (id, payload, token) => apiClient.put(`/jobs/${id}`, payload, { headers: authHeaders(token) }),
  deleteJob: (id, token) => apiClient.delete(`/jobs/${id}`, { headers: authHeaders(token) })
};
