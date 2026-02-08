import { formatUsdc } from "../../lib/formatters";

export function UsdcAmount({ amount, className = "" }: { amount: bigint; className?: string }) {
  return (
    <span className={`font-mono ${className}`}>
      {formatUsdc(amount)} <span className="text-[var(--text-secondary)] text-xs">USDC</span>
    </span>
  );
}
