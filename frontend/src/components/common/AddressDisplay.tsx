import { useState } from "react";
import { truncateAddress } from "../../lib/formatters";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

export function AddressDisplay({ address, label }: { address: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  if (address === ZERO_ADDRESS) {
    return <span className="text-[var(--text-tertiary)] text-sm">None</span>;
  }

  function copy() {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <span className="inline-flex items-center gap-1.5">
      {label && <span className="text-[var(--text-tertiary)] text-sm">{label}</span>}
      <button
        onClick={copy}
        className="btn-press cursor-pointer bg-transparent px-0 py-0 font-mono text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] underline decoration-dotted underline-offset-2 border-none"
        title={copied ? "Copied!" : address}
      >
        {copied ? (
          <span className="flex items-center gap-1 text-[var(--success)]">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Copied
          </span>
        ) : (
          truncateAddress(address)
        )}
      </button>
    </span>
  );
}
