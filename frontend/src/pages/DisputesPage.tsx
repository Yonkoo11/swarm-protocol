import { DisputeList } from "../components/disputes/DisputeList";

export function DisputesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="m-0 text-2xl md:text-3xl">Disputes</h2>
        <p className="m-0 mt-1.5 text-sm text-[var(--text-tertiary)] italic">
          Active and resolved disputes. Jurors vote to decide outcomes.
        </p>
      </div>
      <DisputeList />
    </div>
  );
}
