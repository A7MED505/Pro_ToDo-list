const Todo = require('../models/Todo');

const getTodos = async (req, res) => {
  const todos = await Todo.find({ user: req.user.id }).sort({ createdAt: -1 });
  return res.json({ todos });
};

const createTodo = async (req, res) => {
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ message: 'Title is required.' });
  }

  const todo = await Todo.create({
    title,
    user: req.user.id,
  });

  return res.status(201).json({ todo });
};

const updateTodo = async (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;

  const todo = await Todo.findOne({ _id: id, user: req.user.id });
  if (!todo) {
    return res.status(404).json({ message: 'Todo not found.' });
  }

  if (typeof title === 'string') {
    todo.title = title;
  }

  if (typeof completed === 'boolean') {
    todo.completed = completed;
  }

  await todo.save();
  return res.json({ todo });
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
};
