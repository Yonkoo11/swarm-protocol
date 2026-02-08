import { JurorPanel } from "../components/juror/JurorPanel";

export function JurorPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="m-0 text-xl font-semibold">Juror Pool</h2>
        <p className="m-0 mt-1 text-sm text-[var(--text-tertiary)]">
          Register as a juror to earn fees by resolving disputes.
        </p>
      </div>
      <JurorPanel />
    </div>
  );
}
