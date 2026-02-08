import type { ReactNode } from "react";
import { getErrorMessage } from "../../lib/formatters";

interface TxButtonProps {
  onClick: () => void;
  isPending: boolean;
  isConfirming: boolean;
  isSuccess: boolean;
  error: unknown;
  children: ReactNode;
  disabled?: boolean;
  variant?: "primary" | "danger" | "secondary";
  successMessage?: string;
}

const variantClasses = {
  primary:
    "border-none bg-[var(--text-primary)] hover:bg-[var(--accent-hover)] text-[var(--bg-primary)]",
  danger:
    "border-none bg-[var(--danger)] hover:bg-red-700 text-white",
  secondary:
    "border border-[var(--border-primary)] bg-transparent text-[var(--text-primary)] hover:border-[var(--text-primary)]",
};

export function TxButton({
  onClick,
  isPending,
  isConfirming,
  isSuccess,
  error,
  children,
  disabled,
  variant = "primary",
  successMessage = "Confirmed!",
}: TxButtonProps) {
  const busy = isPending || isConfirming;

  return (
    <div className="flex flex-col gap-1.5">
      <button
        onClick={onClick}
        disabled={disabled || busy}
        className={`btn-press px-4 py-2.5 text-sm font-medium cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${variantClasses[variant]}`}
      >
        {isPending ? (
          <span className="flex items-center gap-2">
            <Spinner />
            Confirm in wallet...
          </span>
        ) : isConfirming ? (
          <span className="flex items-center gap-2">
            <Spinner />
            Confirming...
          </span>
        ) : (
          children
        )}
      </button>
      {isSuccess && (
        <p className="m-0 flex items-center gap-1.5 text-xs text-[var(--success)]">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          {successMessage}
        </p>
      )}
      {error != null && (
        <p className="m-0 flex items-center gap-1.5 text-xs text-[var(--danger)]">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
          {getErrorMessage(error)}
        </p>
      )}
    </div>
  );
}

function Spinner() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="animate-spin">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  );
}
