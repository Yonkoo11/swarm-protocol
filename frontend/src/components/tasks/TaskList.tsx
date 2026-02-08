import { useState } from "react";
import { useAllTasks } from "../../hooks/useSwarmCoordinator";
import { TaskCard } from "./TaskCard";
import { STATUS_LABELS } from "../../lib/constants";

export function TaskList() {
  const { tasks, isLoading, error } = useAllTasks();
  const [filter, setFilter] = useState<number | null>(null);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="skeleton h-24 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-[var(--radius-lg)] border border-[var(--danger)]/20 bg-[var(--danger-muted)] p-8 text-center">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <p className="m-0 text-sm text-[var(--danger)]">Failed to load tasks: {error.message}</p>
      </div>
    );
  }

  const reversed = [...tasks].reverse();
  const filtered = filter !== null
    ? reversed.filter((t) => t.status === filter)
    : reversed;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 flex-wrap">
        <FilterButton active={filter === null} onClick={() => setFilter(null)}>
          All ({reversed.length})
        </FilterButton>
        {Object.entries(STATUS_LABELS).map(([value, label]) => {
          const count = reversed.filter((t) => t.status === Number(value)).length;
          if (count === 0) return null;
          return (
            <FilterButton
              key={value}
              active={filter === Number(value)}
              onClick={() => setFilter(Number(value))}
            >
              {label} ({count})
            </FilterButton>
          );
        })}
      </div>
      {filtered.length === 0 ? (
        <EmptyState filter={filter} />
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((task) => (
            <TaskCard key={task.id.toString()} task={task} />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`btn-press px-2 py-1.5 text-xs font-medium cursor-pointer bg-transparent ${
        active
          ? "border-b-2 border-[var(--text-primary)] text-[var(--text-primary)]"
          : "border-b-2 border-transparent text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
      }`}
    >
      {children}
    </button>
  );
}

function EmptyState({ filter }: { filter: number | null }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-[var(--radius-lg)] border border-dashed border-[var(--border-primary)] py-12 text-center">
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
      <p className="m-0 text-sm text-[var(--text-tertiary)]">
        {filter !== null ? "No tasks match this filter." : "No tasks created yet."}
      </p>
      {filter === null && (
        <a
          href="/create"
          className="btn-press inline-flex items-center gap-1.5 bg-[var(--text-primary)] px-3 py-1.5 text-xs font-medium text-[var(--bg-primary)] no-underline hover:bg-[var(--accent-hover)]"
        >
          Create the first task
        </a>
      )}
    </div>
  );
}
