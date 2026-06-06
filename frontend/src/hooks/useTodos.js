import { useEffect, useState } from 'react';
import { todoService } from '../services/todoService';

export const useTodos = (token) => {
  const [todos, setTodos] = useState([]);
  const [todoError, setTodoError] = useState('');

  useEffect(() => {
    if (!token) {
      return;
    }

    const loadTodos = async () => {
      try {
        const response = await todoService.getAll();
        setTodos(response.data.todos || []);
        setTodoError('');
      } catch (err) {
        setTodoError(err.response?.data?.message || 'Could not load todos.');
      }
    };

    loadTodos();
  }, [token]);

  const createTodo = async (payload) => {
    try {
      const response = await todoService.create(payload);
      setTodos((prev) => [response.data.todo, ...prev]);
      setTodoError('');
      return true;
    } catch (err) {
      setTodoError(err.response?.data?.message || 'Could not create todo.');
      return false;
    }
  };

  const toggleTodo = async (todo) => {
    try {
      const response = await todoService.update(todo._id, {
        completed: !todo.completed,
      });

      setTodos((prev) =>
        prev.map((item) => (item._id === todo._id ? response.data.todo : item)),
      );
      return true;
    } catch (err) {
      setTodoError(err.response?.data?.message || 'Could not update todo.');
      return false;
    }
  };

  const editTodo = async (todoId, payload) => {
    try {
      const response = await todoService.update(todoId, payload);
      setTodos((prev) =>
        prev.map((item) => (item._id === todoId ? response.data.todo : item)),
      );
      setTodoError('');
      return true;
    } catch (err) {
      setTodoError(err.response?.data?.message || 'Could not update todo.');
      return false;
    }
  };

  const deleteTodo = async (todoId) => {
    try {
      await todoService.remove(todoId);
      setTodos((prev) => prev.filter((item) => item._id !== todoId));
      return true;
    } catch (err) {
      setTodoError(err.response?.data?.message || 'Could not delete todo.');
      return false;
    }
  };

  const clearCompleted = async () => {
    try {
      await todoService.clearCompleted();
      setTodos((prev) => prev.filter((item) => !item.completed));
      setTodoError('');
      return true;
    } catch (err) {
      setTodoError(err.response?.data?.message || 'Could not clear completed todos.');
      return false;
    }
  };

  const clearTodoError = () => setTodoError('');

  return {
    todos: token ? todos : [],
    todoError,
    createTodo,
    toggleTodo,
    editTodo,
    deleteTodo,
    clearCompleted,
    clearTodoError,
  };
};
