import { api } from '../api';

export const todoService = {
  getAll: () => api.get('/todos'),
  create: (payload) => api.post('/todos', payload),
  update: (todoId, payload) => api.put(`/todos/${todoId}`, payload),
  remove: (todoId) => api.delete(`/todos/${todoId}`),
  clearCompleted: () => api.delete('/todos/completed'),
};
