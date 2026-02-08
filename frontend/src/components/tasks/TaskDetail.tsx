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

  if (isLoading) return <div className="text-[var(--text-secondary)]">Loading...</div>;
  if (error) return <div className="text-red-400">Error: {error.message}</div>;
  if (!task) return <div className="text-[var(--text-secondary)]">Task not found</div>;

  const isCreator = address?.toLowerCase() === task.creator.toLowerCase();
  const isAssignee = address?.toLowerCase() === task.assignee.toLowerCase();
  const status = task.status;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <h2 className="m-0 text-2xl font-bold">Task #{task.id.toString()}</h2>
        <StatusBadge status={status} />
      </div>

      {/* Info grid */}
      <div className="grid grid-cols-2 gap-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] p-5">
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
          <span>
            {formatDate(task.deadline)}{" "}
            <span className="text-[var(--text-secondary)] text-xs">
              ({formatDeadline(task.deadline)})
            </span>
          </span>
        </InfoRow>
        <InfoRow label="Created">
          <span>{formatDate(task.createdAt)}</span>
        </InfoRow>
        {task.parentTaskId > 0n && (
          <InfoRow label="Parent Task">
            <a href={`/tasks/${task.parentTaskId.toString()}`} className="text-[var(--accent)] no-underline hover:underline">
              #{task.parentTaskId.toString()}
            </a>
          </InfoRow>
        )}
        {task.childCount > 0n && (
          <InfoRow label="Sub-tasks">
            <span>
              {task.childCompleted.toString()} / {task.childCount.toString()} completed
            </span>
          </InfoRow>
        )}
      </div>

      {/* Description hash */}
      <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] p-5">
        <h3 className="m-0 mb-2 text-sm font-medium text-[var(--text-secondary)]">Description Hash</h3>
        <p className="m-0 break-all font-mono text-sm">{task.descriptionHash}</p>
      </div>

      {/* Proof hash */}
      {task.proofHash && (
        <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] p-5">
          <h3 className="m-0 mb-2 text-sm font-medium text-[var(--text-secondary)]">Proof of Work</h3>
          <p className="m-0 break-all font-mono text-sm">{task.proofHash}</p>
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
      <span className="text-xs text-[var(--text-secondary)]">{label}</span>
      <span className="text-sm">{children}</span>
    </div>
  );
}
