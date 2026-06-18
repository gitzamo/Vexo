import api from './client';

export const playRequestApi = {
  send: (data) => api.post('/play-requests', data).then((r) => r.data),
  list: (type) => api.get('/play-requests', { params: type ? { type } : {} }).then((r) => r.data),
  respond: (id, status) => api.patch(`/play-requests/${id}/status`, { status }).then((r) => r.data),
};
