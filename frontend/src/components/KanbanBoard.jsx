const columns = [
  { id: 'todo', title: 'To Do', accentClass: 'todo' },
  { id: 'in_progress', title: 'In Progress', accentClass: 'in-progress' },
  { id: 'done', title: 'Done', accentClass: 'done' },
];

const formatDateTime = (value) => {
  if (!value) {
    return '';
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return '';
  }

  return parsed.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export default function KanbanBoard({ todos, onMove, onDelete }) {
  return (
    <div className="kanban-grid">
      {columns.map((column) => {
        const items = todos.filter((todo) => (todo.status || 'todo') === column.id);

        return (
          <section key={column.id} className={`kanban-column kanban-column-${column.accentClass}`}>
            <header className="kanban-column-head">
              <h3>{column.title}</h3>
              <span>{items.length} tasks</span>
            </header>

            <div className="kanban-column-body">
              {items.length ? (
                items.map((todo) => (
                  <article key={todo._id} className="kanban-card">
                    <h4 title={todo.title}>{todo.title}</h4>
                    <div className="kanban-meta">
                      <span className={`priority-chip priority-${todo.priority || 'medium'}`}>
                        {(todo.priority || 'medium').toUpperCase()}
                      </span>
                      {todo.tags?.slice(0, 2).map((tag) => (
                        <span key={tag} className="tag-chip">
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <div className="kanban-card-details">
                      {todo.dueDate ? (
                        <p className="kanban-reminder">Due: {formatDateTime(todo.dueDate)}</p>
                      ) : null}
                      {todo.reminderAt ? (
                        <p className="kanban-reminder">Reminder: {formatDateTime(todo.reminderAt)}</p>
                      ) : null}
                      {Array.isArray(todo.subtasks) && todo.subtasks.length ? (
                        <p className="kanban-subtasks">
                          Subtasks: {todo.subtasks.filter((item) => item.completed).length}/
                          {todo.subtasks.length}
                        </p>
                      ) : null}
                    </div>
                    <div className="kanban-actions">
                      <select
                        aria-label="Move task status"
                        value={todo.status || 'todo'}
                        onChange={(event) => onMove(todo._id, event.target.value)}
                      >
                        {columns.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.title}
                          </option>
                        ))}
                      </select>
                      <button type="button" className="danger" onClick={() => onDelete(todo._id)}>
                        Delete
                      </button>
                    </div>
                  </article>
                ))
              ) : (
                <p className="kanban-empty">No tasks here.</p>
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}
