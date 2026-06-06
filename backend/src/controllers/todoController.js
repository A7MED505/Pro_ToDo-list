const Todo = require('../models/Todo');

const isValidPriority = (value) => ['low', 'medium', 'high'].includes(value);

const getTodos = async (req, res) => {
  const todos = await Todo.find({ user: req.user.id }).sort({ createdAt: -1 });
  return res.json({ todos });
};

const createTodo = async (req, res) => {
  const { title, priority, dueDate } = req.body;

  const normalizedTitle = title?.trim();
  if (!normalizedTitle) {
    return res.status(400).json({ message: 'Title is required.' });
  }

  const normalizedPriority = priority || 'medium';
  if (!isValidPriority(normalizedPriority)) {
    return res.status(400).json({ message: 'Priority must be low, medium, or high.' });
  }

  let parsedDueDate = null;
  if (dueDate) {
    parsedDueDate = new Date(dueDate);
    if (Number.isNaN(parsedDueDate.getTime())) {
      return res.status(400).json({ message: 'Due date is invalid.' });
    }
  }

  const todo = await Todo.create({
    title: normalizedTitle,
    priority: normalizedPriority,
    dueDate: parsedDueDate,
    user: req.user.id,
  });

  return res.status(201).json({ todo });
};

const updateTodo = async (req, res) => {
  const { id } = req.params;
  const { title, completed, priority, dueDate } = req.body;

  const todo = await Todo.findOne({ _id: id, user: req.user.id });
  if (!todo) {
    return res.status(404).json({ message: 'Todo not found.' });
  }

  if (typeof title === 'string') {
    const normalizedTitle = title.trim();
    if (!normalizedTitle) {
      return res.status(400).json({ message: 'Title is required.' });
    }
    todo.title = normalizedTitle;
  }

  if (typeof completed === 'boolean') {
    todo.completed = completed;
  }

  if (typeof priority === 'string') {
    if (!isValidPriority(priority)) {
      return res.status(400).json({ message: 'Priority must be low, medium, or high.' });
    }
    todo.priority = priority;
  }

  if (dueDate !== undefined) {
    if (dueDate === null || dueDate === '') {
      todo.dueDate = null;
    } else {
      const parsedDueDate = new Date(dueDate);
      if (Number.isNaN(parsedDueDate.getTime())) {
        return res.status(400).json({ message: 'Due date is invalid.' });
      }
      todo.dueDate = parsedDueDate;
    }
  }

  await todo.save();
  return res.json({ todo });
};

const clearCompletedTodos = async (req, res) => {
  const result = await Todo.deleteMany({ user: req.user.id, completed: true });
  return res.json({ deletedCount: result.deletedCount });
};

const deleteTodo = async (req, res) => {
  const { id } = req.params;

  const todo = await Todo.findOneAndDelete({ _id: id, user: req.user.id });
  if (!todo) {
    return res.status(404).json({ message: 'Todo not found.' });
  }

  return res.json({ message: 'Todo deleted successfully.' });
};

module.exports = {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  clearCompletedTodos,
};
