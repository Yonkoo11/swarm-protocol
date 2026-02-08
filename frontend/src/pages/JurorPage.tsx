import { JurorPanel } from "../components/juror/JurorPanel";

export function JurorPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="m-0 text-2xl md:text-3xl">Juror Pool</h2>
        <p className="m-0 mt-1.5 text-sm text-[var(--text-tertiary)] italic">
          Register as a juror to earn fees by resolving disputes.
        </p>
      </div>

      <div className="border border-[var(--border-primary)] p-5" style={{ maxWidth: "65ch" }}>
        <p className="drop-cap m-0 text-[15px] leading-relaxed text-[var(--text-secondary)]">
          The juror pool is the backbone of HiveMind's dispute resolution. When a task
          creator and worker disagree, three jurors are randomly selected from the pool to
          cast their votes. Majority rules, and jurors earn 2% of the task reward for their
          service.
        </p>
      </div>

      <hr className="rule" />

      <JurorPanel />
    </div>
  );
}
