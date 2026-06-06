import { useState } from 'react';

export default function TodoForm({ onCreate }) {
  const [newTodo, setNewTodo] = useState('');
  const [priority, setPriority] = useState('medium');
  const [status, setStatus] = useState('todo');
  const [tagsInput, setTagsInput] = useState('');
  const [subtasksInput, setSubtasksInput] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [reminderAt, setReminderAt] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    const normalizedTitle = newTodo.trim();
    if (!normalizedTitle) {
      return;
    }

    const isSuccess = await onCreate({
      title: normalizedTitle,
      priority,
      status,
      tags: tagsInput
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
      subtasks: subtasksInput
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
        .map((title) => ({ title, completed: false })),
      dueDate: dueDate || null,
      reminderAt: reminderAt || null,
    });
    if (isSuccess) {
      setNewTodo('');
      setPriority('medium');
      setStatus('todo');
      setTagsInput('');
      setSubtasksInput('');
      setDueDate('');
      setReminderAt('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="todo-create">
      <div className="todo-create-main">
        <input
          type="text"
          value={newTodo}
          onChange={(event) => setNewTodo(event.target.value)}
          placeholder="Write a new task..."
        />

        <div className="todo-create-meta">
          <label>
            Priority
            <select value={priority} onChange={(event) => setPriority(event.target.value)}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </label>

          <label>
            Status
            <select value={status} onChange={(event) => setStatus(event.target.value)}>
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </label>

          <label>
            Due Date
            <input
              type="date"
              value={dueDate}
              onChange={(event) => setDueDate(event.target.value)}
            />
          </label>

          <label>
            Reminder
            <input
              type="datetime-local"
              value={reminderAt}
              onChange={(event) => setReminderAt(event.target.value)}
            />
          </label>

          <label className="meta-span-2">
            Tags (comma separated)
            <input
              type="text"
              value={tagsInput}
              onChange={(event) => setTagsInput(event.target.value)}
              placeholder="work, design, urgent"
            />
          </label>

          <label className="meta-span-2">
            Initial subtasks (comma separated)
            <input
              type="text"
              value={subtasksInput}
              onChange={(event) => setSubtasksInput(event.target.value)}
              placeholder="Draft API docs, review UI"
            />
          </label>
        </div>
      </div>
      <button type="submit" className="create-submit">
        Add Task
      </button>
    </form>
  );
}
