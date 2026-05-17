export default function TodoHeader({ userName, completedCount, totalCount, onLogout }) {
  return (
    <div className="todo-top">
      <div>
        <h2>Welcome back, {userName}</h2>
        <p>
          Completed {completedCount} of {totalCount} tasks
        </p>
      </div>
      <button type="button" className="ghost" onClick={onLogout}>
        Logout
      </button>
    </div>
  );
}
