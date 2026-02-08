import { useAccount } from "wagmi";
import { useTask } from "../../hooks/useSwarmCoordinator";
import { StatusBadge } from "../common/StatusBadge";
import { UsdcAmount } from "../common/UsdcAmount";
import { AddressDisplay } from "../common/AddressDisplay";
import { formatDate, formatDeadline } from "../../lib/formatters";
import { TaskStatus } from "../../lib/constants";
import { ClaimButton } from "./ClaimButton";
import { SubmitWorkForm } from "./SubmitWorkForm";
import { ApproveButton } from "./ApproveButton";
import { CancelButton } from "./CancelButton";
import { OpenDisputeBtn } from "../disputes/OpenDisputeBtn";

export function TaskDetail({ taskId }: { taskId: bigint }) {
  const { data: task, isLoading, error, refetch } = useTask(taskId);
  const { address } = useAccount();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="skeleton h-10 w-48" />
        <div className="skeleton h-48 w-full" />
        <div className="skeleton h-24 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-3 border border-[var(--danger)]/20 bg-[var(--danger-muted)] p-8 text-center">
        <p className="m-0 text-sm text-[var(--danger)]">Error: {error.message}</p>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="flex flex-col items-center gap-3 border border-dashed border-[var(--border-primary)] py-12 text-center">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <p className="m-0 text-sm text-[var(--text-tertiary)]">Task not found</p>
      </div>
    );
  }

  const isCreator = address?.toLowerCase() === task.creator.toLowerCase();
  const isAssignee = address?.toLowerCase() === task.assignee.toLowerCase();
  const status = task.status;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <h2 className="m-0 text-xl font-semibold">Task #{task.id.toString()}</h2>
        <StatusBadge status={status} />
      </div>

      {/* Info grid */}
      <div
        className="grid grid-cols-2 gap-4 border border-[var(--border-primary)] p-5"
      >
        <InfoRow label="Reward">
          <UsdcAmount amount={task.reward} />
        </InfoRow>
        <InfoRow label="Bond Required">
          <UsdcAmount amount={task.bondAmount} />
        </InfoRow>
        <InfoRow label="Creator">
          <AddressDisplay address={task.creator} />
        </InfoRow>
        <InfoRow label="Assignee">
          <AddressDisplay address={task.assignee} />
        </InfoRow>
        <InfoRow label="Deadline">
          <span className="tabular-nums">
            {formatDate(task.deadline)}{" "}
            <span className="text-[var(--text-tertiary)] text-xs">
              ({formatDeadline(task.deadline)})
            </span>
          </span>
        </InfoRow>
        <InfoRow label="Created">
          <span className="tabular-nums">{formatDate(task.createdAt)}</span>
        </InfoRow>
        {task.parentTaskId > 0n && (
          <InfoRow label="Parent Task">
            <a href={`/tasks/${task.parentTaskId.toString()}`} className="text-[var(--text-primary)] underline">
              #{task.parentTaskId.toString()}
            </a>
          </InfoRow>
        )}
        {task.childCount > 0n && (
          <InfoRow label="Sub-tasks">
            <span className="tabular-nums">
              {task.childCompleted.toString()} / {task.childCount.toString()} completed
            </span>
          </InfoRow>
        )}
      </div>

      {/* Description */}
      <div
        className="border border-[var(--border-primary)] p-5"
      >
        <h3 className="m-0 mb-2 text-xs font-medium uppercase tracking-wider text-[var(--text-tertiary)]">
          Description
        </h3>
        <p className="m-0 break-all text-sm leading-relaxed text-[var(--text-primary)]">
          {task.descriptionHash}
        </p>
      </div>

      {/* Proof of work */}
      {task.proofHash && (
        <div
          className="border border-[var(--border-primary)] p-5"
        >
          <h3 className="m-0 mb-2 text-xs font-medium uppercase tracking-wider text-[var(--text-tertiary)]">
            Proof of Work
          </h3>
          <p className="m-0 break-all font-mono text-sm text-[var(--text-primary)]">
            {task.proofHash}
          </p>
        </div>
      )}

      {/* Actions */}
      {address && (
        <div className="flex flex-wrap gap-3">
          {status === TaskStatus.Open && !isCreator && (
            <ClaimButton taskId={taskId} bondAmount={task.bondAmount} onSuccess={refetch} />
          )}
          {status === TaskStatus.Open && isCreator && (
            <CancelButton taskId={taskId} onSuccess={refetch} />
          )}
          {status === TaskStatus.Claimed && isAssignee && (
            <SubmitWorkForm taskId={taskId} onSuccess={refetch} />
          )}
          {status === TaskStatus.Submitted && isCreator && (
            <div className="flex gap-3">
              <ApproveButton taskId={taskId} onSuccess={refetch} />
              <OpenDisputeBtn taskId={taskId} onSuccess={refetch} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[11px] font-medium uppercase tracking-wider text-[var(--text-tertiary)]">{label}</span>
      <span className="text-sm">{children}</span>
    </div>
  );
}
