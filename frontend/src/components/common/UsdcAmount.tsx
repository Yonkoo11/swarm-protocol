import { formatUsdc } from "../../lib/formatters";

export function UsdcAmount({ amount, className = "" }: { amount: bigint; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1 tabular-nums ${className}`}>
      <span className="font-mono font-medium">{formatUsdc(amount)}</span>
      <span className="text-[var(--text-tertiary)] text-[11px] font-medium">USDC</span>
    </span>
  );
}
