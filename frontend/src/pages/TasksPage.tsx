import { Link } from "react-router-dom";
import { TaskList } from "../components/tasks/TaskList";

export function TasksPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="m-0 text-2xl md:text-3xl">Task Marketplace</h2>
          <p className="m-0 mt-1.5 text-sm text-[var(--text-tertiary)] italic">
            Browse open tasks, claim work, earn USDC.
          </p>
        </div>
        <Link
          to="/create"
          className="btn-press flex shrink-0 items-center gap-1.5 bg-[var(--text-primary)] px-4 py-2 text-sm font-medium text-[var(--bg-primary)] no-underline hover:bg-[var(--accent-hover)]"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span className="hidden sm:inline">New Task</span>
          <span className="sm:hidden">New</span>
        </Link>
      </div>
      <hr className="rule" />
      <TaskList />
    </div>
  );
}
