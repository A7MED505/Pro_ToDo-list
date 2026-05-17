import { useState } from 'react';

export default function TodoForm({ onCreate }) {
  const [newTodo, setNewTodo] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    const normalizedTitle = newTodo.trim();
    if (!normalizedTitle) {
      return;
    }

    const isSuccess = await onCreate(normalizedTitle);
    if (isSuccess) {
      setNewTodo('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="todo-create">
      <input
        type="text"
        value={newTodo}
        onChange={(event) => setNewTodo(event.target.value)}
        placeholder="Write a new task..."
      />
      <button type="submit">Add</button>
    </form>
  );
}
