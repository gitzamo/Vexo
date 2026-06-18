import api from './client';

export const userApi = {
  updateProfile: (data) => api.put('/users/me', data).then((r) => r.data),
  setPreferredGames: (games) => api.put('/users/me/games', { games }).then((r) => r.data),
  setAvailability: (slots) => api.put('/users/me/availability', { slots }).then((r) => r.data),
  getHistory: () => api.get('/users/me/history').then((r) => r.data),
  search: (params) => api.get('/users/search', { params }).then((r) => r.data),
  getProfile: (id) => api.get(`/users/${id}`).then((r) => r.data),
};
