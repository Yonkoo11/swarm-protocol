import { useState } from "react";
import { truncateAddress } from "../../lib/formatters";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

export function AddressDisplay({ address, label }: { address: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  if (address === ZERO_ADDRESS) {
    return <span className="text-[var(--text-secondary)] text-sm">None</span>;
  }

  function copy() {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <span className="inline-flex items-center gap-1.5">
      {label && <span className="text-[var(--text-secondary)] text-sm">{label}</span>}
      <button
        onClick={copy}
        className="cursor-pointer rounded bg-[var(--bg-tertiary)] px-2 py-0.5 font-mono text-sm text-[var(--text-primary)] hover:bg-[var(--border-color)] transition-colors border-none"
        title={copied ? "Copied!" : address}
      >
        {copied ? "Copied!" : truncateAddress(address)}
      </button>
    </span>
  );
}
