import { useEffect, useMemo, useState } from 'react';
import './App.css';
import AuthForm from './components/AuthForm';
import AppFooter from './components/AppFooter';
import KanbanView from './components/KanbanView';
import ListView from './components/ListView';
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
          <KanbanView
            userName={user.name}
            completedCount={completedCount}
            totalCount={todos.length}
            activeCount={activeCount}
            overdueCount={overdueCount}
            reminderCount={reminderCount}
            onLogout={handleLogout}
            onClearCompleted={handleClearCompleted}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            sortBy={sortBy}
            onSortChange={setSortBy}
            filter={filter}
            onFilterChange={setFilter}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            filterOptions={filterOptions}
            sortOptions={sortOptions}
            onCreateTodo={handleCreateTodo}
            visibleTodos={visibleTodos}
            onMoveTodo={(todoId, status) => handleEditTodo(todoId, { status })}
            onDeleteTodo={handleDeleteTodo}
            emptyMessage={emptyMessage}
          />
        ) : (
          <ListView
            userName={user.name}
            completedCount={completedCount}
            totalCount={todos.length}
            completionRate={completionRate}
            activeCount={activeCount}
            overdueCount={overdueCount}
            reminderCount={reminderCount}
            onLogout={handleLogout}
            onClearCompleted={handleClearCompleted}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            sortBy={sortBy}
            onSortChange={setSortBy}
            filter={filter}
            onFilterChange={setFilter}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            filterOptions={filterOptions}
            sortOptions={sortOptions}
            onCreateTodo={handleCreateTodo}
            visibleTodos={visibleTodos}
            onToggleTodo={handleToggleTodo}
            onDeleteTodo={handleDeleteTodo}
            onEditTodo={handleEditTodo}
            emptyMessage={emptyMessage}
          />
        )
      )}

      <AppFooter />
    </div>
  );
}

export default App;
