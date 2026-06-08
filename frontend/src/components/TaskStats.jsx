export default function TaskStats({
  activeCount,
  completedCount,
  totalCount,
  overdueCount,
  reminderCount,
  className,
  includeTotal = true,
  ariaLabel = 'Task summary',
}) {
  return (
    <div className={className} aria-label={ariaLabel}>
      <div className="stat-card">
        <span>Open</span>
        <strong>{activeCount}</strong>
      </div>
      <div className="stat-card">
        <span>Done</span>
        <strong>{completedCount}</strong>
      </div>
      {includeTotal ? (
        <div className="stat-card">
          <span>Total</span>
          <strong>{totalCount}</strong>
        </div>
      ) : null}
      <div className="stat-card">
        <span>Overdue</span>
        <strong>{overdueCount}</strong>
      </div>
      <div className="stat-card">
        <span className="stat-label-compact">Reminder</span>
        <strong>{reminderCount}</strong>
      </div>
    </div>
  );
}
