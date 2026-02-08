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
      <div
        className="border border-[var(--border-primary)] p-5"
      >
        <h3 className="m-0 mb-4 text-xs font-medium uppercase tracking-wider text-[var(--text-tertiary)]">
          Pool Status
        </h3>
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--text-secondary)]">Pool Size</span>
            <span className="tabular-nums text-sm font-mono font-medium">{poolSize?.toString() ?? "-"}</span>
          </div>
          {address && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-[var(--text-secondary)]">Your Status</span>
              {isJuror ? (
                <span className="inline-flex items-center gap-1.5 text-sm text-[var(--success)]">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Registered
                </span>
              ) : (
                <span className="text-sm text-[var(--text-tertiary)]">Not registered</span>
              )}
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

      <div
        className="border border-[var(--border-primary)] p-5"
      >
        <h3 className="m-0 mb-3 text-xs font-medium uppercase tracking-wider text-[var(--text-tertiary)]">
          How It Works
        </h3>
        <div className="flex flex-col gap-3">
          {[
            { step: "1", text: "Register to join the juror pool" },
            { step: "2", text: "When a dispute opens, 3 jurors are randomly selected" },
            { step: "3", text: "Each juror votes for the worker or the creator" },
            { step: "4", text: "Majority wins. Jurors earn 2% of the task reward" },
          ].map((item) => (
            <div key={item.step} className="flex items-start gap-3">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center border border-[var(--text-primary)] text-[10px] font-semibold text-[var(--text-primary)]">
                {item.step}
              </span>
              <span className="text-sm text-[var(--text-secondary)]">{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
