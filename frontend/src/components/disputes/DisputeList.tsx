import { useAllDisputes } from "../../hooks/useSwarmCoordinator";
import { DisputeDetail } from "./DisputeDetail";

export function DisputeList() {
  const { disputes, isLoading, error } = useAllDisputes();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        {[1, 2].map((i) => (
          <div key={i} className="skeleton h-40 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-[var(--radius-lg)] border border-[var(--danger)]/20 bg-[var(--danger-muted)] p-8 text-center">
        <p className="m-0 text-sm text-[var(--danger)]">Error: {error.message}</p>
      </div>
    );
  }

  if (disputes.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-[var(--radius-lg)] border border-dashed border-[var(--border-primary)] py-12 text-center">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
        <p className="m-0 text-sm text-[var(--text-tertiary)]">No disputes yet. All tasks resolved peacefully.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {[...disputes].reverse().map((d) => (
        <DisputeDetail key={d.id.toString()} disputeId={d.id} />
      ))}
    </div>
  );
}
