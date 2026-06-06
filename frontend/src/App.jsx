import { useEffect, useMemo, useState } from 'react';
import './App.css';
import AuthForm from './components/AuthForm';
import TodoForm from './components/TodoForm';
import TodoHeader from './components/TodoHeader';
import TodoList from './components/TodoList';
import KanbanBoard from './components/KanbanBoard';
import { useAuth } from './hooks/useAuth';
import { useTodos } from './hooks/useTodos';

const filterOptions = [
  { id: 'all', label: 'All tasks' },
  { id: 'active', label: 'Active' },
  { id: 'completed', label: 'Completed' },
];

const sortOptions = [
  { id: 'newest', label: 'Newest' },
  { id: 'oldest', label: 'Oldest' },
  { id: 'priority', label: 'Priority' },
  { id: 'dueSoon', label: 'Due soon' },
];

const priorityWeight = {
  high: 3,
  medium: 2,
  low: 1,
};

function App() {
  const { user, token, loading, authError, login, register, logout, clearAuthError } =
    useAuth();
  const {
    todos,
    todoError,
    createTodo,
    toggleTodo,
    editTodo,
    deleteTodo,
    clearCompleted,
    clearTodoError,
  } = useTodos(token);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('list');
  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem('todo-theme');
    if (stored === 'dark' || stored === 'light') {
      return stored;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('todo-theme', theme);
  }, [theme]);

  const completedCount = useMemo(
    () => todos.filter((item) => item.completed).length,
    [todos],
  );

  const activeCount = todos.length - completedCount;
  const visibleTodos = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    const filtered = todos.filter((todo) => {
      const matchesFilter =
        filter === 'all' ||
        (filter === 'active' && !todo.completed) ||
        (filter === 'completed' && todo.completed);
      const matchesSearch = normalizedQuery
        ? todo.title.toLowerCase().includes(normalizedQuery)
        : true;

      return matchesFilter && matchesSearch;
    });

    return filtered.sort((a, b) => {
      if (sortBy === 'oldest') {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }

      if (sortBy === 'priority') {
        return (priorityWeight[b.priority] || 0) - (priorityWeight[a.priority] || 0);
      }

      if (sortBy === 'dueSoon') {
        if (!a.dueDate && !b.dueDate) {
          return new Date(b.createdAt) - new Date(a.createdAt);
        }
        if (!a.dueDate) {
          return 1;
        }
        if (!b.dueDate) {
          return -1;
        }
        return new Date(a.dueDate) - new Date(b.dueDate);
      }

      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }, [todos, searchQuery, filter, sortBy]);

  const overdueCount = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return todos.filter((todo) => {
      if (!todo.dueDate || todo.completed) {
        return false;
      }
      const due = new Date(todo.dueDate);
      due.setHours(0, 0, 0, 0);
      return due < today;
    }).length;
  }, [todos]);

  const reminderCount = useMemo(() => {
    const now = new Date();
    return todos.filter((todo) => {
      if (!todo.reminderAt || todo.completed) {
        return false;
      }
      const reminder = new Date(todo.reminderAt);
      return reminder <= now;
    }).length;
  }, [todos]);

  const completionRate = todos.length ? Math.round((completedCount / todos.length) * 100) : 0;

  const error = authError || todoError;

  const handleLogin = async (payload) => {
    clearTodoError();
    return login(payload);
  };

  const handleRegister = async (payload) => {
    clearTodoError();
    return register(payload);
  };

  const handleCreateTodo = async (payload) => {
    clearAuthError();
    return createTodo(payload);
  };

  const handleToggleTodo = async (todo) => {
    clearAuthError();
    return toggleTodo(todo);
  };

  const handleDeleteTodo = async (todoId) => {
    clearAuthError();
    return deleteTodo(todoId);
  };

  const handleEditTodo = async (todoId, payload) => {
    clearAuthError();
    return editTodo(todoId, payload);
  };

  const handleLogout = () => {
    setSearchQuery('');
    setFilter('all');
    setSortBy('newest');
    setViewMode('list');
    return logout();
  };

  const handleClearCompleted = async () => {
    clearAuthError();
    return clearCompleted();
  };

  const emptyMessage = todos.length
    ? 'No tasks match your current search or filter.'
    : 'No todos yet. Add your first task.';

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <div className="app-shell">
      <header className="app-hero card">
        <div className="app-header-top">
          <h1>ToDo List</h1>
          <button type="button" className="theme-toggle" onClick={handleToggleTheme}>
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
        <p className="hero-subtitle">Plan your day, protect your time, and finish what matters.</p>
      </header>

      {error ? <p className="alert">{error}</p> : null}

      {!user ? (
        <AuthForm onLogin={handleLogin} onRegister={handleRegister} loading={loading} />
      ) : (
        viewMode === 'kanban' ? (
          <section className="kanban-page card">
            <div className="kanban-page-top">
              <TodoHeader
                userName={user.name}
                completedCount={completedCount}
                totalCount={todos.length}
                onLogout={handleLogout}
              />

              <div className="kanban-page-summary" aria-label="Task summary">
                <div className="stat-card">
                  <span>Open</span>
                  <strong>{activeCount}</strong>
                </div>
                <div className="stat-card">
                  <span>Done</span>
                  <strong>{completedCount}</strong>
                </div>
                <div className="stat-card">
                  <span>Overdue</span>
                  <strong>{overdueCount}</strong>
                </div>
                <div className="stat-card">
                  <span className="stat-label-compact">Reminder</span>
                  <strong>{reminderCount}</strong>
                </div>
              </div>
            </div>

            <div className="todo-toolbar">
              <div className="toolbar-row">
                <label className="search-box">
                  Search tasks
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Filter by title..."
                  />
                </label>

                <label className="sort-box">
                  Sort by
                  <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
                    {sortOptions.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="filter-group" role="tablist" aria-label="Task filters">
                {filterOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    className={filter === option.id ? 'filter-pill active' : 'filter-pill'}
                    onClick={() => setFilter(option.id)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              <div className="view-switch" role="tablist" aria-label="Task view mode">
                <button
                  type="button"
                  className={viewMode === 'list' ? 'filter-pill active' : 'filter-pill'}
                  onClick={() => setViewMode('list')}
                >
                  List
                </button>
                <button
                  type="button"
                  className={viewMode === 'kanban' ? 'filter-pill active' : 'filter-pill'}
                  onClick={() => setViewMode('kanban')}
                >
                  Kanban
                </button>
              </div>
            </div>

            <div className="kanban-form-wrap">
              <TodoForm onCreate={handleCreateTodo} />
            </div>

            <div className="todo-actions">
              <p className="todo-meta">Showing {visibleTodos.length} of {todos.length} tasks</p>
              {completedCount > 0 ? (
                <button type="button" className="ghost secondary" onClick={handleClearCompleted}>
                  Clear completed tasks
                </button>
              ) : null}
            </div>

            {visibleTodos.length ? (
              <KanbanBoard
                todos={visibleTodos}
                onMove={(todoId, status) => handleEditTodo(todoId, { status })}
                onDelete={handleDeleteTodo}
              />
            ) : (
              <p className="empty">{emptyMessage}</p>
            )}
          </section>
        ) : (
          <section className="workspace-grid">
            <aside className="workspace-sidebar card">
              <TodoHeader
                userName={user.name}
                completedCount={completedCount}
                totalCount={todos.length}
                onLogout={handleLogout}
              />

              <div className="progress-panel" aria-label="Completion progress">
                <div className="progress-title-row">
                  <span>Weekly progress</span>
                  <strong>{completionRate}%</strong>
                </div>
                <div className="progress-track">
                  <span className="progress-fill" style={{ width: `${completionRate}%` }} />
                </div>
              </div>

              <div className="todo-stats" aria-label="Task summary">
                <div className="stat-card">
                  <span>Open</span>
                  <strong>{activeCount}</strong>
                </div>
                <div className="stat-card">
                  <span>Done</span>
                  <strong>{completedCount}</strong>
                </div>
                <div className="stat-card">
                  <span>Total</span>
                  <strong>{todos.length}</strong>
                </div>
                <div className="stat-card">
                  <span>Overdue</span>
                  <strong>{overdueCount}</strong>
                </div>
                <div className="stat-card">
                  <span className="stat-label-compact">Reminder</span>
                  <strong>{reminderCount}</strong>
                </div>
              </div>

              {completedCount > 0 ? (
                <button
                  type="button"
                  className="ghost secondary full-width"
                  onClick={handleClearCompleted}
                >
                  Clear completed tasks
                </button>
              ) : null}
            </aside>

            <main className="workspace-main card">
              <div className="todo-toolbar">
                <div className="toolbar-row">
                  <label className="search-box">
                    Search tasks
                    <input
                      type="search"
                      value={searchQuery}
                      onChange={(event) => setSearchQuery(event.target.value)}
                      placeholder="Filter by title..."
                    />
                  </label>

                  <label className="sort-box">
                    Sort by
                    <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
                      {sortOptions.map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="filter-group" role="tablist" aria-label="Task filters">
                  {filterOptions.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      className={filter === option.id ? 'filter-pill active' : 'filter-pill'}
                      onClick={() => setFilter(option.id)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>

                <div className="view-switch" role="tablist" aria-label="Task view mode">
                  <button
                    type="button"
                    className={viewMode === 'list' ? 'filter-pill active' : 'filter-pill'}
                    onClick={() => setViewMode('list')}
                  >
                    List
                  </button>
                  <button
                    type="button"
                    className={viewMode === 'kanban' ? 'filter-pill active' : 'filter-pill'}
                    onClick={() => setViewMode('kanban')}
                  >
                    Kanban
                  </button>
                </div>
              </div>

              <TodoForm onCreate={handleCreateTodo} />

              <div className="todo-actions">
                <p className="todo-meta">Showing {visibleTodos.length} of {todos.length} tasks</p>
              </div>

              {visibleTodos.length ? (
                <TodoList
                  todos={visibleTodos}
                  onToggle={handleToggleTodo}
                  onDelete={handleDeleteTodo}
                  onEdit={handleEditTodo}
                />
              ) : (
                <p className="empty">{emptyMessage}</p>
              )}
            </main>
          </section>
        )
      )}

      <footer className="app-footer" aria-label="Application footer">
        <div className="app-footer-inner">
          <p className="app-footer-copy">© 2026 ToDo List, Inc.</p>
          <nav className="app-footer-links" aria-label="Footer links">
            <a href="#">Terms</a>
            <a href="#">Privacy</a>
            <a href="#">Security</a>
            <a href="#">Status</a>
            <a href="#">Community</a>
            <a href="#">Docs</a>
            <a href="#">Contact</a>
            <a href="#">Manage cookies</a>
            <a href="#">Do not share my personal information</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}

export default App;
