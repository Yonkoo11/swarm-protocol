import { Link } from "react-router-dom";
import { TaskList } from "../components/tasks/TaskList";
import { useAllTasks, useDisputeCount } from "../hooks/useSwarmCoordinator";
import { formatUsdc } from "../lib/formatters";

export function TasksPage() {
  const { tasks, isLoading } = useAllTasks();
  const { data: disputeCount } = useDisputeCount();

  const totalTasks = tasks.length;
  const openTasks = tasks.filter((t) => t.status === 0).length;
  const usdcPool = tasks
    .filter((t) => t.status === 0)
    .reduce((sum, t) => sum + t.reward, 0n);
  const disputes = disputeCount != null ? Number(disputeCount) : null;

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

      {/* Protocol Stats Bar */}
      <div className="border border-[var(--border-primary)] px-6 py-4">
        <div className="flex items-center justify-center gap-0">
          <StatCell
            value={isLoading ? "-" : String(totalTasks)}
            label="tasks"
          />
          <StatDivider />
          <StatCell
            value={isLoading ? "-" : String(openTasks)}
            label="open"
          />
          <StatDivider />
          <StatCell
            value={isLoading ? "-" : formatUsdc(usdcPool)}
            label="USDC pool"
          />
          <StatDivider />
          <StatCell
            value={disputes != null ? String(disputes) : "-"}
            label="disputes"
          />
        </div>
      </div>

      <hr className="rule" />
      <TaskList />
    </div>
  );
}

function StatCell({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1 px-5 sm:px-8">
      <span className="text-2xl sm:text-3xl font-semibold tabular-nums font-mono text-[var(--text-primary)] leading-none">
        {value}
      </span>
      <span className="section-label text-[10px] sm:text-[11px] tracking-[0.08em]">
        {label}
      </span>
    </div>
  );
}

function StatDivider() {
  return (
    <span className="text-[var(--text-tertiary)] text-lg select-none">/</span>
  );
}
