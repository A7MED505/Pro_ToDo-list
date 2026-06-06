const Todo = require('../models/Todo');

const isValidPriority = (value) => ['low', 'medium', 'high'].includes(value);
const isValidStatus = (value) => ['todo', 'in_progress', 'done'].includes(value);

const normalizeTags = (value) => {
  if (value === undefined) {
    return undefined;
  }

  const source = Array.isArray(value) ? value : String(value).split(',');
  return [...new Set(source.map((item) => String(item).trim().toLowerCase()).filter(Boolean))];
};

const normalizeSubtasks = (value) => {
  if (value === undefined) {
    return undefined;
  }

  if (!Array.isArray(value)) {
    return null;
  }

  const normalized = value
    .map((subtask) => {
      const title = subtask?.title?.trim();
      if (!title) {
        return null;
      }

      return {
        title,
        completed: Boolean(subtask?.completed),
      };
    })
    .filter(Boolean);

  return normalized;
};

const parseDateOrNull = (value) => {
  if (value === undefined) {
    return undefined;
  }

  if (value === null || value === '') {
    return null;
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const getTodos = async (req, res) => {
  const todos = await Todo.find({ user: req.user.id }).sort({ createdAt: -1 });
  return res.json({ todos });
};

const createTodo = async (req, res) => {
  const { title, priority, dueDate, reminderAt, status, tags, subtasks } = req.body;

  const normalizedTitle = title?.trim();
  if (!normalizedTitle) {
    return res.status(400).json({ message: 'Title is required.' });
  }

  const normalizedPriority = priority || 'medium';
  if (!isValidPriority(normalizedPriority)) {
    return res.status(400).json({ message: 'Priority must be low, medium, or high.' });
  }

  const normalizedStatus = status || 'todo';
  if (!isValidStatus(normalizedStatus)) {
    return res.status(400).json({ message: 'Status must be todo, in_progress, or done.' });
  }

  const normalizedTags = normalizeTags(tags) || [];
  const normalizedSubtasks = normalizeSubtasks(subtasks);
  if (normalizedSubtasks === null) {
    return res.status(400).json({ message: 'Subtasks must be an array.' });
  }

  const parsedDueDate = parseDateOrNull(dueDate);
  if (parsedDueDate === null && dueDate) {
    return res.status(400).json({ message: 'Due date is invalid.' });
  }

  const parsedReminderAt = parseDateOrNull(reminderAt);
  if (parsedReminderAt === null && reminderAt) {
    return res.status(400).json({ message: 'Reminder date is invalid.' });
  }

  const todo = await Todo.create({
    title: normalizedTitle,
    status: normalizedStatus,
    completed: normalizedStatus === 'done',
    priority: normalizedPriority,
    tags: normalizedTags,
    subtasks: normalizedSubtasks || [],
    dueDate: parsedDueDate,
    reminderAt: parsedReminderAt,
    user: req.user.id,
  });

  return res.status(201).json({ todo });
};

const updateTodo = async (req, res) => {
  const { id } = req.params;
  const { title, completed, priority, dueDate, reminderAt, status, tags, subtasks } = req.body;

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
    if (completed) {
      todo.status = 'done';
    } else if (todo.status === 'done') {
      todo.status = 'todo';
    }
  }

  if (typeof status === 'string') {
    if (!isValidStatus(status)) {
      return res.status(400).json({ message: 'Status must be todo, in_progress, or done.' });
    }
    todo.status = status;
    todo.completed = status === 'done';
  }

  if (typeof priority === 'string') {
    if (!isValidPriority(priority)) {
      return res.status(400).json({ message: 'Priority must be low, medium, or high.' });
    }
    todo.priority = priority;
  }

  if (dueDate !== undefined) {
    const parsedDueDate = parseDateOrNull(dueDate);
    if (parsedDueDate === null && dueDate) {
      return res.status(400).json({ message: 'Due date is invalid.' });
    }
    todo.dueDate = parsedDueDate;
  }

  if (reminderAt !== undefined) {
    const parsedReminderAt = parseDateOrNull(reminderAt);
    if (parsedReminderAt === null && reminderAt) {
      return res.status(400).json({ message: 'Reminder date is invalid.' });
    }
    todo.reminderAt = parsedReminderAt;
  }

  if (tags !== undefined) {
    const normalizedTags = normalizeTags(tags);
    todo.tags = normalizedTags || [];
  }

  if (subtasks !== undefined) {
    const normalizedSubtasks = normalizeSubtasks(subtasks);
    if (normalizedSubtasks === null) {
      return res.status(400).json({ message: 'Subtasks must be an array.' });
    }
    todo.subtasks = normalizedSubtasks;
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
