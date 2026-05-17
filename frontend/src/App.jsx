import { useMemo, useState } from 'react';
import './App.css';
import AuthForm from './components/AuthForm';
import TodoForm from './components/TodoForm';
import TodoHeader from './components/TodoHeader';
import TodoList from './components/TodoList';
import { useAuth } from './hooks/useAuth';
import { useTodos } from './hooks/useTodos';

const filterOptions = [
  { id: 'all', label: 'All tasks' },
  { id: 'active', label: 'Active' },
  { id: 'completed', label: 'Completed' },
];

function App() {
  const { user, token, loading, authError, login, register, logout, clearAuthError } =
    useAuth();
  const {
    todos,
    todoError,
    createTodo,
    toggleTodo,
    deleteTodo,
    clearCompleted,
    clearTodoError,
  } = useTodos(token);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');

  const completedCount = useMemo(
    () => todos.filter((item) => item.completed).length,
    [todos],
  );

  const activeCount = todos.length - completedCount;
  const visibleTodos = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return todos.filter((todo) => {
      const matchesFilter =
        filter === 'all' ||
        (filter === 'active' && !todo.completed) ||
        (filter === 'completed' && todo.completed);
      const matchesSearch = normalizedQuery
        ? todo.title.toLowerCase().includes(normalizedQuery)
        : true;

      return matchesFilter && matchesSearch;
    });
  }, [todos, searchQuery, filter]);

  const error = authError || todoError;

  const handleLogin = async (payload) => {
    clearTodoError();
    return login(payload);
  };

  const handleRegister = async (payload) => {
    clearTodoError();
    return register(payload);
  };

  const handleCreateTodo = async (title) => {
    clearAuthError();
    return createTodo(title);
  };

  const handleToggleTodo = async (todo) => {
    clearAuthError();
    return toggleTodo(todo);
  };

  const handleDeleteTodo = async (todoId) => {
    clearAuthError();
    return deleteTodo(todoId);
  };

  const handleLogout = () => {
    setSearchQuery('');
    setFilter('all');
    return logout();
  };

  const handleClearCompleted = async () => {
    clearAuthError();
    return clearCompleted();
  };

  const emptyMessage = todos.length
    ? 'No tasks match your current search or filter.'
    : 'No todos yet. Add your first task.';

  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>FocusFlow Todo</h1>
        <p>Plan your day, protect your time, and finish what matters.</p>
      </header>

      {error ? <p className="alert">{error}</p> : null}

      {!user ? (
        <AuthForm onLogin={handleLogin} onRegister={handleRegister} loading={loading} />
      ) : (
        <section className="card todo-card">
          <TodoHeader
            userName={user.name}
            completedCount={completedCount}
            totalCount={todos.length}
            onLogout={handleLogout}
          />

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
          </div>

          <div className="todo-toolbar">
            <label className="search-box">
              Search tasks
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Filter by title..."
              />
            </label>

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
          </div>

          <TodoForm onCreate={handleCreateTodo} />

          <div className="todo-actions">
            <p className="todo-meta">Showing {visibleTodos.length} of {todos.length} tasks</p>
            {completedCount > 0 ? (
              <button type="button" className="ghost secondary" onClick={handleClearCompleted}>
                Clear completed
              </button>
            ) : null}
          </div>

          {visibleTodos.length ? (
            <TodoList todos={visibleTodos} onToggle={handleToggleTodo} onDelete={handleDeleteTodo} />
          ) : (
            <p className="empty">{emptyMessage}</p>
          )}
        </section>
      )}
    </div>
  );
}

export default App;
