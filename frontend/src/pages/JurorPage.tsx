import { JurorPanel } from "../components/juror/JurorPanel";

export function JurorPage() {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="m-0 text-2xl font-bold">Juror Pool</h2>
      <JurorPanel />
    </div>
  );
}
