import apiClient, { authHeaders } from './api';

export const authService = {
  login: (credentials) => apiClient.post('/auth/login', credentials),
  signup: (payload) => apiClient.post('/auth/signup', payload),
  googleLogin: (credential) => apiClient.post('/auth/google', { credential }),
  updateProfile: (payload, token) => apiClient.put('/auth/profile', payload, { headers: authHeaders(token) }),
  updatePassword: (payload, token) => apiClient.put('/auth/profile/password', payload, { headers: authHeaders(token) }),
  uploadResume: (formData, token) => apiClient.post('/auth/profile/resume', formData, { headers: authHeaders(token) }),
  deleteResume: (token) => apiClient.delete('/auth/profile/resume', { headers: authHeaders(token) }),
  forgotPassword: (payload) => apiClient.post('/auth/forgot-password', payload),
  resetPassword: (payload) => apiClient.post('/auth/reset-password', payload)
};
