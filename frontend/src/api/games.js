import api from './client';

export const gamesApi = {
  list: () => api.get('/games').then((r) => r.data),
  create: (data) => api.post('/games', data).then((r) => r.data),
  update: (id, data) => api.put(`/games/${id}`, data).then((r) => r.data),
};
