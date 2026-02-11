import { useEffect, useRef } from "react";
import { STATUS_LABELS } from "../../lib/constants";
import { formatUsdc, truncateAddress } from "../../lib/formatters";
import type { Task } from "../../lib/types";

const STATUS_NAMES: Record<number, string> = {
  0: "open",
  1: "claimed",
  2: "submitted",
  3: "disputed",
  4: "completed",
  5: "cancelled",
};

interface TaskCardProps {
  task: Task;
  index?: number;
  onClick: () => void;
}

export function TaskCard({ task, index = 0, onClick }: TaskCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const timer = setTimeout(() => el.classList.add("visible"), 40 + index * 60);
    return () => clearTimeout(timer);
  }, [index]);

  const statusName = STATUS_NAMES[task.status] ?? "open";

  return (
    <div
      ref={ref}
      className="task-card"
      data-status={statusName}
      onClick={onClick}
    >
      <div className="task-card-top">
        <span className="task-card-title">
          {task.descriptionHash || `Task #${task.id.toString()}`}
        </span>
        <span className="task-card-amount">${formatUsdc(task.reward)}</span>
      </div>
      <div className="task-card-meta">
        <div className="status-indicator">
          <span className="status-dot" data-status={statusName} />
          <span className="status-text" data-status={statusName}>
            {STATUS_LABELS[task.status] ?? "Unknown"}
          </span>
        </div>
        <span className="task-card-poster">{truncateAddress(task.creator)}</span>
      </div>
    </div>
  );
}
