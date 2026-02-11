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

  const variantClass = variant === "danger" ? "danger" : variant === "secondary" ? "secondary" : "";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <button
        onClick={onClick}
        disabled={disabled || busy}
        className={`sheet-cta ${variantClass}`}
      >
        {isPending ? (
          <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            <svg className="tx-spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </svg>
            Confirm in wallet...
          </span>
        ) : isConfirming ? (
          <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            <svg className="tx-spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </svg>
            Confirming...
          </span>
        ) : (
          children
        )}
      </button>
      {isSuccess && (
        <div className="tx-feedback success">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          {successMessage}
        </div>
      )}
      {error != null && (
        <div className="tx-feedback error">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
          {getErrorMessage(error)}
        </div>
      )}
    </div>
  );
}
