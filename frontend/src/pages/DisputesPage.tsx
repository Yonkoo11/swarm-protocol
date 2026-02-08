import { DisputeList } from "../components/disputes/DisputeList";
import { useAllDisputes } from "../hooks/useSwarmCoordinator";

export function DisputesPage() {
  const { disputes, isLoading } = useAllDisputes();

  const hasData = !isLoading && disputes.length > 0;
  const total = disputes.length;
  const resolved = disputes.filter((d) => d.resolved).length;
  const active = total - resolved;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="m-0 text-2xl md:text-3xl">Disputes</h2>
        <p className="m-0 mt-1.5 text-sm text-[var(--text-tertiary)] italic">
          Active and resolved disputes. Jurors vote to decide outcomes.
        </p>
      </div>

      {hasData && (
        <>
          <div className="border border-[var(--border-primary)] p-5">
            <div className="flex items-center justify-center gap-0">
              <div className="flex flex-col items-center px-6">
                <span className="font-serif text-3xl tabular-nums">{total}</span>
                <span className="section-label mt-1">total</span>
              </div>
              <span className="text-xl text-[var(--border-primary)]">/</span>
              <div className="flex flex-col items-center px-6">
                <span className="font-serif text-3xl tabular-nums">{active}</span>
                <span className="section-label mt-1">active</span>
              </div>
              <span className="text-xl text-[var(--border-primary)]">/</span>
              <div className="flex flex-col items-center px-6">
                <span className="font-serif text-3xl tabular-nums">{resolved}</span>
                <span className="section-label mt-1">resolved</span>
              </div>
            </div>
          </div>
          <hr className="rule" />
        </>
      )}

      <DisputeList />
    </div>
  );
}
