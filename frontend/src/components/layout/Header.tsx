import { ConnectButton } from "@rainbow-me/rainbowkit";

export function Header() {
  return (
    <header className="flex items-center justify-between border-b border-[var(--border-color)] bg-[var(--bg-secondary)] px-6 py-3">
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-bold tracking-tight">
          <span className="text-[var(--accent)]">Hive</span>Mind
        </h1>
        <span className="rounded-full bg-[var(--bg-tertiary)] px-2 py-0.5 text-[10px] text-[var(--text-secondary)]">
          Base Sepolia
        </span>
      </div>
      <ConnectButton showBalance={false} />
    </header>
  );
}
