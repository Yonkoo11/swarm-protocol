import { useState } from "react";
import { useAllTasks } from "../../hooks/useSwarmCoordinator";
import { TaskCard } from "./TaskCard";
import { STATUS_LABELS } from "../../lib/constants";

export function TaskList() {
  const { tasks, isLoading, error } = useAllTasks();
  const [filter, setFilter] = useState<number | null>(null);

  if (isLoading) {
    return <div className="text-[var(--text-secondary)] text-sm">Loading tasks...</div>;
  }

  if (error) {
    return <div className="text-red-400 text-sm">Error loading tasks: {error.message}</div>;
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
        <p className="text-sm text-[var(--text-secondary)]">No tasks found.</p>
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
      className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
        active
          ? "border-[var(--accent)] bg-[var(--accent)]/15 text-[var(--accent)]"
          : "border-[var(--border-color)] bg-transparent text-[var(--text-secondary)] hover:border-[var(--accent)]/40"
      }`}
    >
      {children}
    </button>
  );
}
