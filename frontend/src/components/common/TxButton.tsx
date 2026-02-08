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
  primary: "bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white",
  danger: "bg-red-600 hover:bg-red-700 text-white",
  secondary: "bg-[var(--bg-tertiary)] hover:bg-[var(--border-color)] text-[var(--text-primary)]",
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
    <div className="flex flex-col gap-1">
      <button
        onClick={onClick}
        disabled={disabled || busy}
        className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-all border-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses[variant]}`}
      >
        {isPending ? "Confirm in wallet..." : isConfirming ? "Confirming..." : children}
      </button>
      {isSuccess && (
        <p className="text-xs text-emerald-400 m-0">{successMessage}</p>
      )}
      {error != null && (
        <p className="text-xs text-red-400 m-0">{getErrorMessage(error)}</p>
      )}
    </div>
  );
}
