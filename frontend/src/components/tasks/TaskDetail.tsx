import { useAccount } from "wagmi";
import { STATUS_LABELS, TaskStatus } from "../../lib/constants";
import { formatUsdc, truncateAddress, formatDeadline, formatDate } from "../../lib/formatters";
import { ClaimButton } from "./ClaimButton";
import { SubmitWorkForm } from "./SubmitWorkForm";
import { ApproveButton } from "./ApproveButton";
import { CancelButton } from "./CancelButton";
import { OpenDisputeBtn } from "../disputes/OpenDisputeBtn";
import type { Task } from "../../lib/types";

interface TaskDetailProps {
  task: Task;
  onClose: () => void;
}

export function TaskDetail({ task, onClose }: TaskDetailProps) {
  const { address } = useAccount();

  const isCreator = address?.toLowerCase() === task.creator.toLowerCase();
  const isAssignee = address?.toLowerCase() === task.assignee.toLowerCase();
  const status = task.status;

  return (
    <>
      <div className="sheet-amount">
        ${formatUsdc(task.reward)}<span className="currency">USDC</span>
      </div>
      <div className="sheet-title">
        {task.descriptionHash || `Task #${task.id.toString()}`}
      </div>

      <div className="sheet-detail-grid">
        <div className="sheet-detail-cell">
          <div className="sheet-detail-label">Status</div>
          <div className="sheet-detail-value">{STATUS_LABELS[status] ?? "Unknown"}</div>
        </div>
        <div className="sheet-detail-cell">
          <div className="sheet-detail-label">Bond</div>
          <div className="sheet-detail-value">${formatUsdc(task.bondAmount)}</div>
        </div>
        <div className="sheet-detail-cell">
          <div className="sheet-detail-label">Creator</div>
          <div className="sheet-detail-value">{truncateAddress(task.creator)}</div>
        </div>
        <div className="sheet-detail-cell">
          <div className="sheet-detail-label">Assignee</div>
          <div className="sheet-detail-value">
            {task.assignee === "0x0000000000000000000000000000000000000000"
              ? "None"
              : truncateAddress(task.assignee)}
          </div>
        </div>
        <div className="sheet-detail-cell">
          <div className="sheet-detail-label">Deadline</div>
          <div className="sheet-detail-value">{formatDeadline(task.deadline)}</div>
        </div>
        <div className="sheet-detail-cell">
          <div className="sheet-detail-label">Created</div>
          <div className="sheet-detail-value">{formatDate(task.createdAt)}</div>
        </div>
        {task.parentTaskId > 0n && (
          <div className="sheet-detail-cell">
            <div className="sheet-detail-label">Parent</div>
            <div className="sheet-detail-value">#{task.parentTaskId.toString()}</div>
          </div>
        )}
        {task.childCount > 0n && (
          <div className="sheet-detail-cell">
            <div className="sheet-detail-label">Sub-tasks</div>
            <div className="sheet-detail-value">
              {task.childCompleted.toString()}/{task.childCount.toString()}
            </div>
          </div>
        )}
      </div>

      {task.descriptionHash && (
        <div className="sheet-description">{task.descriptionHash}</div>
      )}

      {task.proofHash && (
        <div style={{ marginBottom: 16 }}>
          <div className="sheet-detail-label" style={{ marginBottom: 6 }}>Proof of Work</div>
          <div style={{ fontSize: 12, fontFamily: "'JetBrains Mono', monospace", color: "var(--text-secondary)", wordBreak: "break-all" }}>
            {task.proofHash}
          </div>
        </div>
      )}

      {address && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {status === TaskStatus.Open && !isCreator && (
            <ClaimButton taskId={task.id} bondAmount={task.bondAmount} onSuccess={onClose} />
          )}
          {status === TaskStatus.Open && isCreator && (
            <CancelButton taskId={task.id} onSuccess={onClose} />
          )}
          {status === TaskStatus.Claimed && isAssignee && (
            <SubmitWorkForm taskId={task.id} onSuccess={onClose} />
          )}
          {status === TaskStatus.Submitted && isCreator && (
            <>
              <ApproveButton taskId={task.id} onSuccess={onClose} />
              <OpenDisputeBtn taskId={task.id} onSuccess={onClose} />
            </>
          )}
        </div>
      )}
    </>
  );
}
