export default function TodoItem({ todo, onToggle, onDelete }) {
  return (
    <li className={todo.completed ? 'done' : ''}>
      <label>
        <input type="checkbox" checked={todo.completed} onChange={() => onToggle(todo)} />
        <span>{todo.title}</span>
      </label>
      <button type="button" className="danger" onClick={() => onDelete(todo._id)}>
        Delete
      </button>
    </li>
  );
}
