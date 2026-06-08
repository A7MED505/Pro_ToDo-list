export default function TodoToolbar({
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
}) {
  return (
    <div className="todo-toolbar">
      <div className="toolbar-row">
        <label className="search-box">
          Search tasks
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Filter by title..."
          />
        </label>

        <label className="sort-box">
          Sort by
          <select value={sortBy} onChange={(event) => onSortChange(event.target.value)}>
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
            onClick={() => onFilterChange(option.id)}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="view-switch" role="tablist" aria-label="Task view mode">
        <button
          type="button"
          className={viewMode === 'list' ? 'filter-pill active' : 'filter-pill'}
          onClick={() => onViewModeChange('list')}
        >
          List
        </button>
        <button
          type="button"
          className={viewMode === 'kanban' ? 'filter-pill active' : 'filter-pill'}
          onClick={() => onViewModeChange('kanban')}
        >
          Kanban
        </button>
      </div>
    </div>
  );
}
