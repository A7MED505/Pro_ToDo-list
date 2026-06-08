import TodoForm from './TodoForm';
import TodoHeader from './TodoHeader';
import TodoList from './TodoList';
import TaskStats from './TaskStats';
import TodoToolbar from './TodoToolbar';

export default function ListView({
  userName,
  completedCount,
  totalCount,
  completionRate,
  activeCount,
  overdueCount,
  reminderCount,
  onLogout,
  onClearCompleted,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  filter,
  onFilterChange,
  viewMode,
  onViewModeChange,
  filterOptions,
  sortOptions,
  onCreateTodo,
  visibleTodos,
  onToggleTodo,
  onDeleteTodo,
  onEditTodo,
  emptyMessage,
}) {
  return (
    <section className="workspace-grid">
      <aside className="workspace-sidebar card">
        <TodoHeader
          userName={userName}
          completedCount={completedCount}
          totalCount={totalCount}
          onLogout={onLogout}
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

        <TaskStats
          className="todo-stats"
          activeCount={activeCount}
          completedCount={completedCount}
          totalCount={totalCount}
          overdueCount={overdueCount}
          reminderCount={reminderCount}
          includeTotal
        />

        {completedCount > 0 ? (
          <button type="button" className="ghost secondary full-width" onClick={onClearCompleted}>
            Clear completed tasks
          </button>
        ) : null}
      </aside>

      <main className="workspace-main card">
        <TodoToolbar
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          sortBy={sortBy}
          onSortChange={onSortChange}
          filter={filter}
          onFilterChange={onFilterChange}
          viewMode={viewMode}
          onViewModeChange={onViewModeChange}
          filterOptions={filterOptions}
          sortOptions={sortOptions}
        />

        <TodoForm onCreate={onCreateTodo} />

        <div className="todo-actions">
          <p className="todo-meta">
            Showing {visibleTodos.length} of {totalCount} tasks
          </p>
        </div>

        {visibleTodos.length ? (
          <TodoList
            todos={visibleTodos}
            onToggle={onToggleTodo}
            onDelete={onDeleteTodo}
            onEdit={onEditTodo}
          />
        ) : (
          <p className="empty">{emptyMessage}</p>
        )}
      </main>
    </section>
  );
}
