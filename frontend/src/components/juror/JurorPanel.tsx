import { useAccount } from "wagmi";
import { useJurorPoolSize, useIsJuror } from "../../hooks/useSwarmCoordinator";
import { useRegisterJuror } from "../../hooks/useDisputeActions";
import { TxButton } from "../common/TxButton";

export function JurorPanel() {
  const { address } = useAccount();
  const { data: poolSize } = useJurorPoolSize();
  const { data: isJuror } = useIsJuror(address);
  const { registerJuror, isPending, isConfirming, isSuccess, error } = useRegisterJuror();

  return (
    <div className="flex flex-col gap-5 max-w-md">
      <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] p-5">
        <h3 className="m-0 mb-3 text-lg font-bold">Juror Pool</h3>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between">
            <span className="text-sm text-[var(--text-secondary)]">Pool Size</span>
            <span className="text-sm font-mono">{poolSize?.toString() ?? "..."}</span>
          </div>
          {address && (
            <div className="flex justify-between">
              <span className="text-sm text-[var(--text-secondary)]">Your Status</span>
              <span className={`text-sm ${isJuror ? "text-emerald-400" : "text-[var(--text-secondary)]"}`}>
                {isJuror ? "Registered" : "Not registered"}
              </span>
            </div>
          )}
        </div>
      </div>

      {address && !isJuror && (
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
      )}

      <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] p-5">
        <h3 className="m-0 mb-2 text-sm font-medium text-[var(--text-secondary)]">How it works</h3>
        <ul className="m-0 flex flex-col gap-1 pl-4 text-sm text-[var(--text-secondary)]">
          <li>Register to join the juror pool</li>
          <li>When a dispute is opened, 3 jurors are randomly selected</li>
          <li>Each juror votes for the worker or the creator</li>
          <li>Majority wins. Jurors earn 2% of the task reward</li>
        </ul>
      </div>
    </div>
  );
}
