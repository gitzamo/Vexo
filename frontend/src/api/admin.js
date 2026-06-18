import api from './client';

export const adminApi = {
  listUsers: () => api.get('/admin/users').then((r) => r.data),
  setUserStatus: (id, is_active) => api.patch(`/admin/users/${id}/status`, { is_active }).then((r) => r.data),
  setUserRole: (id, role) => api.patch(`/admin/users/${id}/role`, { role }).then((r) => r.data),
  stats: () => api.get('/admin/stats').then((r) => r.data),
};
