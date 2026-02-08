import { useAccount } from "wagmi";
import { useDispute, useTask } from "../../hooks/useSwarmCoordinator";
import { AddressDisplay } from "../common/AddressDisplay";
import { StatusBadge } from "../common/StatusBadge";
import { VoteButton } from "./VoteButton";

const ZERO = "0x0000000000000000000000000000000000000000";

export function DisputeDetail({ disputeId }: { disputeId: bigint }) {
  const { data: dispute, isLoading, refetch } = useDispute(disputeId);
  const { data: task } = useTask(dispute?.taskId ?? 0n);
  const { address } = useAccount();

  if (isLoading) return <div className="skeleton h-40 w-full" />;
  if (!dispute) {
    return (
      <div className="flex flex-col items-center gap-3 border border-dashed border-[var(--border-primary)] py-8 text-center">
        <p className="m-0 text-sm text-[var(--text-tertiary)]">Dispute not found</p>
      </div>
    );
  }

  const jurorIndex = address
    ? dispute.jurors.findIndex((j) => j.toLowerCase() === address.toLowerCase())
    : -1;
  const isJuror = jurorIndex >= 0;

  return (
    <div
      className="flex flex-col gap-4 border border-[var(--border-primary)] p-5"
    >
      <div className="flex items-center gap-3">
        <h3 className="m-0 text-base font-semibold">Dispute #{disputeId.toString()}</h3>
        {dispute.resolved ? (
          <span className="inline-flex items-center border border-[var(--text-tertiary)] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">
            Resolved
          </span>
        ) : (
          <span className="inline-flex items-center border border-[var(--danger)] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--danger)]">
            Active
          </span>
        )}
      </div>

      {task && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-[var(--text-tertiary)]">Task:</span>
          <a href={`/tasks/${task.id.toString()}`} className="text-[var(--text-primary)] underline text-sm">
            #{task.id.toString()}
          </a>
          <StatusBadge status={task.status} />
        </div>
      )}

      <div className="flex flex-col gap-2">
        <span className="section-label">
          Jurors ({dispute.voteCount}/3 voted)
        </span>
        <div className="flex flex-col gap-1.5">
          {dispute.jurors.map((juror, i) => (
            <div key={i} className="flex items-center gap-2 border-b border-[var(--border-primary)] px-3 py-2">
              {juror === ZERO ? (
                <span className="text-xs text-[var(--text-tertiary)]">Slot {i + 1}: Empty</span>
              ) : (
                <>
                  <AddressDisplay address={juror} />
                  {i < dispute.voteCount && (
                    <span className={`ml-auto text-xs font-medium ${dispute.votes[i] ? "text-[var(--success)]" : "text-[var(--danger)]"}`}>
                      {dispute.votes[i] ? "For worker" : "For creator"}
                    </span>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {isJuror && !dispute.resolved && (
        <div className="flex gap-3 border-t border-[var(--border-primary)] pt-4">
          <VoteButton disputeId={disputeId} inFavorOfAssignee={true} onSuccess={refetch} />
          <VoteButton disputeId={disputeId} inFavorOfAssignee={false} onSuccess={refetch} />
        </div>
      )}
    </div>
  );
}
