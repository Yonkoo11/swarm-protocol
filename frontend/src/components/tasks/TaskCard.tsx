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
      className="block border-b border-[var(--border-primary)] py-4 px-0 no-underline hover:bg-[var(--bg-tertiary)]"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="tabular-nums text-xs font-medium text-[var(--text-tertiary)]">
              #{task.id.toString()}
            </span>
            <StatusBadge status={task.status} />
            {task.parentTaskId > 0n && (
              <span className="border border-[var(--border-primary)] px-1.5 py-0.5 text-[10px] font-medium text-[var(--text-tertiary)]">
                Sub-task of #{task.parentTaskId.toString()}
              </span>
            )}
          </div>
          <p className="m-0 text-sm leading-snug text-[var(--text-primary)] line-clamp-1" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            {task.descriptionHash}
          </p>
          <AddressDisplay address={task.creator} label="by" />
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1.5">
          <UsdcAmount amount={task.reward} className="text-sm" />
          <span className="text-[11px] text-[var(--text-tertiary)]">
            Bond: <UsdcAmount amount={task.bondAmount} className="text-[11px]" />
          </span>
          <span className="tabular-nums text-[11px] text-[var(--text-tertiary)]">
            {formatDeadline(task.deadline)}
          </span>
        </div>
      </div>
    </Link>
  );
}
