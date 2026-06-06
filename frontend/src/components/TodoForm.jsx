import { useState } from 'react';

export default function TodoForm({ onCreate }) {
  const [newTodo, setNewTodo] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    const normalizedTitle = newTodo.trim();
    if (!normalizedTitle) {
      return;
    }

    const isSuccess = await onCreate({
      title: normalizedTitle,
      priority,
      dueDate: dueDate || null,
    });
    if (isSuccess) {
      setNewTodo('');
      setPriority('medium');
      setDueDate('');
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
            Due Date
            <input
              type="date"
              value={dueDate}
              onChange={(event) => setDueDate(event.target.value)}
            />
          </label>
        </div>
      </div>
      <button type="submit">Add</button>
    </form>
  );
}
