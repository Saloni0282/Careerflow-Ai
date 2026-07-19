import apiClient, { authHeaders } from './api';

export const savedService = {
  getSavedJobs: (token) => apiClient.get('/saved', { headers: authHeaders(token) }),
  addSavedJob: (payload, token) => apiClient.post('/saved', payload, { headers: authHeaders(token) }),
  removeSavedJob: (id, token) => apiClient.delete(`/saved/${id}`, { headers: authHeaders(token) })
};
