import { useAccount } from "wagmi";
import { useAllDisputes, useAllTasks, useJurorPoolSize, useIsJuror } from "../../hooks/useSwarmCoordinator";
import { useRegisterJuror } from "../../hooks/useDisputeActions";
import { formatUsdc } from "../../lib/formatters";
import { TxButton } from "../common/TxButton";

export function JuryTab() {
  const { address } = useAccount();
  const { data: poolSize } = useJurorPoolSize();
  const { data: isJuror } = useIsJuror(address);
  const { registerJuror, isPending, isConfirming, isSuccess, error } = useRegisterJuror();
  const { disputes } = useAllDisputes();
  const { tasks } = useAllTasks();

  const activeDisputes = disputes.filter(d => !d.resolved);
  const resolvedDisputes = disputes.filter(d => d.resolved);

  return (
    <>
      <div className="juror-panel">
        <div className="juror-panel-header">
          <span className="juror-panel-title">Juror Status</span>
          <span className="juror-stake-badge">
            {poolSize?.toString() ?? "0"} jurors
          </span>
        </div>
        <div className="juror-stats">
          <div className="juror-stat">
            <div className="juror-stat-value">{disputes.length}</div>
            <div className="juror-stat-label">Cases</div>
          </div>
          <div className="juror-stat">
            <div className="juror-stat-value">{activeDisputes.length}</div>
            <div className="juror-stat-label">Active</div>
          </div>
          <div className="juror-stat">
            <div className="juror-stat-value">{resolvedDisputes.length}</div>
            <div className="juror-stat-label">Resolved</div>
          </div>
        </div>
      </div>

      {address && !isJuror && (
        <div style={{ marginBottom: 16 }}>
          <TxButton
            onClick={registerJuror}
            isPending={isPending}
            isConfirming={isConfirming}
            isSuccess={isSuccess}
            error={error}
            successMessage="Registered as juror!"
          >
            Register as Juror
          </TxButton>
        </div>
      )}

      {address && isJuror && (
        <div style={{ marginBottom: 16, textAlign: "center", fontSize: 11, color: "var(--sage)", fontWeight: 600 }}>
          You are a registered juror
        </div>
      )}

      {activeDisputes.length > 0 && (
        <>
          <div className="section-header">Active Disputes ({activeDisputes.length})</div>
          {activeDisputes.map(dispute => {
            const task = tasks.find(t => t.id === dispute.taskId);
            const approveVotes = dispute.votes.filter(Boolean).length;
            const totalVotes = dispute.voteCount;
            const approvePercent = totalVotes > 0 ? Math.round((approveVotes / totalVotes) * 100) : 50;
            const rejectPercent = 100 - approvePercent;

            return (
              <div key={dispute.id.toString()} className="dispute-card">
                <div className="dispute-header">
                  <span className="dispute-title">
                    {task?.descriptionHash || `Dispute for Task #${dispute.taskId.toString()}`}
                  </span>
                  <span className="dispute-amount">
                    ${task ? formatUsdc(task.reward) : "?"}
                  </span>
                </div>
                <div className="vote-bar-container">
                  <div className="vote-bar-labels">
                    <span className="vote-bar-label approve">Approve {approvePercent}%</span>
                    <span className="vote-bar-label reject">Reject {rejectPercent}%</span>
                  </div>
                  <div className="vote-bar">
                    <div className="vote-bar-fill" style={{ width: `${approvePercent}%` }} />
                  </div>
                </div>
                <div className="dispute-meta">
                  <span className="dispute-voters">{totalVotes}/3 voted</span>
                </div>
              </div>
            );
          })}
        </>
      )}

      {resolvedDisputes.length > 0 && (
        <>
          <div className={`section-header${activeDisputes.length > 0 ? " mt-16" : ""}`}>
            Resolved ({resolvedDisputes.length})
          </div>
          {resolvedDisputes.map(dispute => {
            const task = tasks.find(t => t.id === dispute.taskId);
            const approveVotes = dispute.votes.filter(Boolean).length;

            return (
              <div key={dispute.id.toString()} className="dispute-card">
                <div className="dispute-header">
                  <span className="dispute-title">
                    {task?.descriptionHash || `Dispute for Task #${dispute.taskId.toString()}`}
                  </span>
                  <span className="dispute-amount">
                    ${task ? formatUsdc(task.reward) : "?"}
                  </span>
                </div>
                <div className="dispute-meta">
                  <span className="dispute-voters" style={{ color: approveVotes >= 2 ? "var(--sage)" : "var(--warm-red)" }}>
                    {approveVotes >= 2 ? "Worker approved" : "Creator upheld"}
                  </span>
                </div>
              </div>
            );
          })}
        </>
      )}

      {disputes.length === 0 && (
        <div className="empty-state">
          <svg className="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L22 7V17L12 22L2 17V7Z"/>
            <line x1="12" y1="7" x2="12" y2="14"/>
            <line x1="8" y1="9.5" x2="16" y2="9.5"/>
          </svg>
          <span className="empty-state-text">No disputes</span>
          <span className="empty-state-hint">All tasks are running smoothly</span>
        </div>
      )}
    </>
  );
}
