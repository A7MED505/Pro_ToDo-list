import { useMemo, useState } from 'react';

const formatDueDate = (value) => {
  if (!value) {
    return '';
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? ''
    : date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
};

export default function TodoItem({ todo, onToggle, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const [priority, setPriority] = useState(todo.priority || 'medium');
  const [dueDate, setDueDate] = useState(todo.dueDate ? todo.dueDate.slice(0, 10) : '');

  const isOverdue = useMemo(() => {
    if (!todo.dueDate || todo.completed) {
      return false;
    }

    const current = new Date();
    current.setHours(0, 0, 0, 0);
    const target = new Date(todo.dueDate);
    target.setHours(0, 0, 0, 0);
    return target < current;
  }, [todo.dueDate, todo.completed]);

  const dueDateLabel = formatDueDate(todo.dueDate);

  const handleSave = async () => {
    const normalizedTitle = title.trim();
    if (!normalizedTitle) {
      return;
    }

    const isSuccess = await onEdit(todo._id, {
      title: normalizedTitle,
      priority,
      dueDate: dueDate || null,
    });

    if (isSuccess) {
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setTitle(todo.title);
    setPriority(todo.priority || 'medium');
    setDueDate(todo.dueDate ? todo.dueDate.slice(0, 10) : '');
  };

  return (
    <li className={`${todo.completed ? 'done' : ''} ${isOverdue ? 'overdue' : ''}`}>
      {isEditing ? (
        <div className="todo-edit-panel">
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Task title"
          />
          <div className="todo-edit-meta">
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
          <div className="todo-item-actions">
            <button type="button" className="ghost" onClick={handleSave}>
              Save
            </button>
            <button type="button" className="ghost" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <label>
            <input type="checkbox" checked={todo.completed} onChange={() => onToggle(todo)} />
            <div className="todo-details">
              <span>{todo.title}</span>
              <div className="todo-meta-row">
                <span className={`priority-chip priority-${todo.priority || 'medium'}`}>
                  {(todo.priority || 'medium').toUpperCase()}
                </span>
                {dueDateLabel ? (
                  <span className={`due-chip ${isOverdue ? 'late' : ''}`}>Due {dueDateLabel}</span>
                ) : null}
              </div>
            </div>
          </label>
          <div className="todo-item-actions">
            <button type="button" className="ghost" onClick={() => setIsEditing(true)}>
              Edit
            </button>
            <button type="button" className="danger" onClick={() => onDelete(todo._id)}>
              Delete
            </button>
          </div>
        </>
      )}
    </li>
  );
}
