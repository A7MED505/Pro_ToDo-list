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
  const [status, setStatus] = useState(todo.status || 'todo');
  const [tagsText, setTagsText] = useState((todo.tags || []).join(', '));
  const [dueDate, setDueDate] = useState(todo.dueDate ? todo.dueDate.slice(0, 10) : '');
  const [reminderAt, setReminderAt] = useState(
    todo.reminderAt ? new Date(todo.reminderAt).toISOString().slice(0, 16) : '',
  );
  const [newSubtask, setNewSubtask] = useState('');

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
  const reminderLabel = formatDueDate(todo.reminderAt);

  const handleSave = async () => {
    const normalizedTitle = title.trim();
    if (!normalizedTitle) {
      return;
    }

    const isSuccess = await onEdit(todo._id, {
      title: normalizedTitle,
      priority,
      status,
      tags: tagsText
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
      dueDate: dueDate || null,
      reminderAt: reminderAt || null,
    });

    if (isSuccess) {
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setTitle(todo.title);
    setPriority(todo.priority || 'medium');
    setStatus(todo.status || 'todo');
    setTagsText((todo.tags || []).join(', '));
    setDueDate(todo.dueDate ? todo.dueDate.slice(0, 10) : '');
    setReminderAt(todo.reminderAt ? new Date(todo.reminderAt).toISOString().slice(0, 16) : '');
  };

  const handleToggleSubtask = async (subtaskId) => {
    const updated = (todo.subtasks || []).map((subtask) =>
      subtask._id === subtaskId
        ? { ...subtask, completed: !subtask.completed }
        : subtask,
    );
    await onEdit(todo._id, { subtasks: updated });
  };

  const handleAddSubtask = async () => {
    const normalized = newSubtask.trim();
    if (!normalized) {
      return;
    }

    const updated = [...(todo.subtasks || []), { title: normalized, completed: false }];
    const isSuccess = await onEdit(todo._id, { subtasks: updated });
    if (isSuccess) {
      setNewSubtask('');
    }
  };

  const handleRemoveSubtask = async (subtaskId) => {
    const updated = (todo.subtasks || []).filter((subtask) => subtask._id !== subtaskId);
    await onEdit(todo._id, { subtasks: updated });
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
              Tags
              <input
                type="text"
                value={tagsText}
                onChange={(event) => setTagsText(event.target.value)}
                placeholder="work, urgent"
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
                <span className="status-chip">{(todo.status || 'todo').replace('_', ' ')}</span>
                {dueDateLabel ? (
                  <span className={`due-chip ${isOverdue ? 'late' : ''}`}>Due {dueDateLabel}</span>
                ) : null}
                {reminderLabel ? <span className="reminder-chip">Reminder {reminderLabel}</span> : null}
                {todo.tags?.map((tag) => (
                  <span key={tag} className="tag-chip">
                    #{tag}
                  </span>
                ))}
              </div>
              <div className="subtasks-block">
                {(todo.subtasks || []).map((subtask) => (
                  <div key={subtask._id || subtask.title} className="subtask-row">
                    <label>
                      <input
                        type="checkbox"
                        checked={Boolean(subtask.completed)}
                        onChange={() => handleToggleSubtask(subtask._id)}
                      />
                      <span>{subtask.title}</span>
                    </label>
                    <button
                      type="button"
                      className="ghost"
                      onClick={() => handleRemoveSubtask(subtask._id)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <div className="subtask-create">
                  <input
                    type="text"
                    value={newSubtask}
                    onChange={(event) => setNewSubtask(event.target.value)}
                    placeholder="Add subtask"
                  />
                  <button type="button" className="ghost" onClick={handleAddSubtask}>
                    Add subtask
                  </button>
                </div>
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
