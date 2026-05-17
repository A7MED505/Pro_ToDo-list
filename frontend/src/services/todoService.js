import { api } from '../api';

export const todoService = {
  getAll: () => api.get('/todos'),
  create: (title) => api.post('/todos', { title }),
  update: (todoId, payload) => api.put(`/todos/${todoId}`, payload),
  remove: (todoId) => api.delete(`/todos/${todoId}`),
};
