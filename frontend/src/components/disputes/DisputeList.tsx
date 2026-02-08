import { useAllDisputes } from "../../hooks/useSwarmCoordinator";
import { DisputeDetail } from "./DisputeDetail";

export function DisputeList() {
  const { disputes, isLoading, error } = useAllDisputes();

  if (isLoading) return <div className="text-[var(--text-secondary)] text-sm">Loading disputes...</div>;
  if (error) return <div className="text-red-400 text-sm">Error: {error.message}</div>;

  if (disputes.length === 0) {
    return <p className="text-sm text-[var(--text-secondary)]">No disputes yet.</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      {[...disputes].reverse().map((d) => (
        <DisputeDetail key={d.id.toString()} disputeId={d.id} />
      ))}
    </div>
  );
}
