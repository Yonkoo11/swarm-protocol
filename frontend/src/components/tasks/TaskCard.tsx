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
      className="task-item block border-b border-[var(--border-primary)] py-5 no-underline"
    >
      <div className="flex items-start justify-between gap-6">
        <div className="flex min-w-0 flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <span className="tabular-nums text-[11px] text-[var(--text-tertiary)]">
              No. {task.id.toString()}
            </span>
            <StatusBadge status={task.status} />
            {task.parentTaskId > 0n && (
              <span className="border border-[var(--border-primary)] px-1.5 py-0.5 text-[10px] font-medium text-[var(--text-tertiary)]">
                Sub-task of #{task.parentTaskId.toString()}
              </span>
            )}
          </div>
          <p className="headline m-0 text-base leading-snug text-[var(--text-primary)] line-clamp-2">
            {task.descriptionHash}
          </p>
          <div className="mt-0.5">
            <AddressDisplay address={task.creator} label="by" />
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          <span className="font-semibold text-lg tabular-nums text-[var(--text-primary)]">
            <UsdcAmount amount={task.reward} className="text-base" />
          </span>
          <span className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-wider">
            Bond: <UsdcAmount amount={task.bondAmount} className="text-[10px]" />
          </span>
          <span className="tabular-nums text-[11px] text-[var(--text-tertiary)] italic">
            {formatDeadline(task.deadline)}
          </span>
        </div>
      </div>
    </Link>
  );
}
