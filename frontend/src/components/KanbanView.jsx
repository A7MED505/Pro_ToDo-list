import KanbanBoard from './KanbanBoard';
import TodoForm from './TodoForm';
import TodoHeader from './TodoHeader';
import TaskStats from './TaskStats';
import TodoToolbar from './TodoToolbar';

export default function KanbanView({
  userName,
  completedCount,
  totalCount,
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
  onMoveTodo,
  onDeleteTodo,
  emptyMessage,
}) {
  return (
    <section className="kanban-page card">
      <div className="kanban-page-top">
        <TodoHeader
          userName={userName}
          completedCount={completedCount}
          totalCount={totalCount}
          onLogout={onLogout}
        />

        <TaskStats
          className="kanban-page-summary"
          activeCount={activeCount}
          completedCount={completedCount}
          totalCount={totalCount}
          overdueCount={overdueCount}
          reminderCount={reminderCount}
          includeTotal={false}
        />
      </div>

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

      <div className="kanban-form-wrap">
        <TodoForm onCreate={onCreateTodo} />
      </div>

      <div className="todo-actions">
        <p className="todo-meta">
          Showing {visibleTodos.length} of {totalCount} tasks
        </p>
        {completedCount > 0 ? (
          <button type="button" className="ghost secondary" onClick={onClearCompleted}>
            Clear completed tasks
          </button>
        ) : null}
      </div>

      {visibleTodos.length ? (
        <KanbanBoard todos={visibleTodos} onMove={onMoveTodo} onDelete={onDeleteTodo} />
      ) : (
        <p className="empty">{emptyMessage}</p>
      )}
    </section>
  );
}
