import { Link } from "react-router-dom";
import { StatusBadge } from "../common/StatusBadge";
import { UsdcAmount } from "../common/UsdcAmount";
import { AddressDisplay } from "../common/AddressDisplay";
import { formatDeadline } from "../../lib/formatters";
import type { Task } from "../../lib/types";

export function TaskCard({ task }: { task: Task }) {
  return (
    <Link
      to={`/tasks/${task.id.toString()}`}
      className="block rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] p-4 transition-all hover:border-[var(--accent)]/40 hover:bg-[var(--bg-tertiary)] no-underline"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-[var(--text-secondary)]">
              #{task.id.toString()}
            </span>
            <StatusBadge status={task.status} />
            {task.parentTaskId > 0n && (
              <span className="rounded bg-[var(--bg-tertiary)] px-1.5 py-0.5 text-[10px] text-[var(--text-secondary)]">
                Sub-task of #{task.parentTaskId.toString()}
              </span>
            )}
          </div>
          <p className="m-0 text-sm text-[var(--text-primary)] line-clamp-1 font-mono">
            {task.descriptionHash}
          </p>
          <AddressDisplay address={task.creator} label="by" />
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <UsdcAmount amount={task.reward} className="text-sm" />
          <span className="text-xs text-[var(--text-secondary)]">
            Bond: <UsdcAmount amount={task.bondAmount} className="text-xs" />
          </span>
          <span className="text-xs text-[var(--text-secondary)]">
            {formatDeadline(task.deadline)}
          </span>
        </div>
      </div>
    </Link>
  );
}
