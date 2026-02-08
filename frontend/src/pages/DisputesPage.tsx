import { DisputeList } from "../components/disputes/DisputeList";
import { useDisputeCount } from "../hooks/useSwarmCoordinator";

export function DisputesPage() {
  const { data: disputeCount } = useDisputeCount();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-baseline gap-3">
        <h2 className="m-0 text-2xl font-bold">Disputes</h2>
        {disputeCount != null && (
          <span className="text-sm text-[var(--text-secondary)]">
            {String(disputeCount)} total
          </span>
        )}
      </div>
      <DisputeList />
    </div>
  );
}
