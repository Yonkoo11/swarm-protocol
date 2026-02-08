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

  if (isLoading) return <div className="text-[var(--text-secondary)]">Loading...</div>;
  if (!dispute) return <div className="text-[var(--text-secondary)]">Dispute not found</div>;

  const jurorIndex = address
    ? dispute.jurors.findIndex((j) => j.toLowerCase() === address.toLowerCase())
    : -1;
  const isJuror = jurorIndex >= 0;

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] p-5">
      <div className="flex items-center gap-3">
        <h3 className="m-0 text-lg font-bold">Dispute #{disputeId.toString()}</h3>
        {dispute.resolved ? (
          <span className="rounded-full bg-gray-500/20 px-2 py-0.5 text-xs text-gray-400">Resolved</span>
        ) : (
          <span className="rounded-full bg-red-500/20 px-2 py-0.5 text-xs text-red-400">Active</span>
        )}
      </div>

      {task && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-[var(--text-secondary)]">Task:</span>
          <a href={`/tasks/${task.id.toString()}`} className="text-[var(--accent)] no-underline text-sm hover:underline">
            #{task.id.toString()}
          </a>
          <StatusBadge status={task.status} />
        </div>
      )}

      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-[var(--text-secondary)]">
          Jurors ({dispute.voteCount}/3 voted)
        </span>
        {dispute.jurors.map((juror, i) => (
          <div key={i} className="flex items-center gap-2">
            {juror === ZERO ? (
              <span className="text-xs text-[var(--text-secondary)]">Slot {i + 1}: Empty</span>
            ) : (
              <>
                <AddressDisplay address={juror} />
                {i < dispute.voteCount && (
                  <span className={`text-xs ${dispute.votes[i] ? "text-emerald-400" : "text-red-400"}`}>
                    {dispute.votes[i] ? "For worker" : "For creator"}
                  </span>
                )}
              </>
            )}
          </div>
        ))}
      </div>

      {isJuror && !dispute.resolved && (
        <div className="flex gap-3 pt-2">
          <VoteButton disputeId={disputeId} inFavorOfAssignee={true} onSuccess={refetch} />
          <VoteButton disputeId={disputeId} inFavorOfAssignee={false} onSuccess={refetch} />
        </div>
      )}
    </div>
  );
}
