import { NavLink } from "react-router-dom";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useTaskCount, useJurorPoolSize } from "../../hooks/useSwarmCoordinator";

const navLinks = [
  { to: "/tasks", label: "Marketplace" },
  { to: "/create", label: "Post Task" },
  { to: "/my-tasks", label: "My Tasks" },
  { to: "/disputes", label: "Disputes" },
  { to: "/juror", label: "Juror Pool" },
];

export function Header() {
  const { data: taskCount } = useTaskCount();
  const { data: jurorPoolSize } = useJurorPoolSize();

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="w-full bg-[var(--bg-primary)]">
      {/* Masthead */}
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 pt-6 pb-4 text-center">
        <p className="m-0 text-[11px] uppercase tracking-[0.2em] text-[var(--text-tertiary)] mb-2">
          Decentralised Task Protocol on Base
        </p>
        <h1 className="m-0 text-5xl md:text-6xl tracking-tight text-[var(--text-primary)]">
          HiveMind
        </h1>
        <p className="m-0 text-[12px] text-[var(--text-tertiary)] mt-2">
          {today}
        </p>
      </div>

      {/* Heavy rule */}
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <hr className="rule rule--heavy" />
      </div>

      {/* Nav + Stats + Wallet row */}
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-3">
        <div className="flex items-center justify-between flex-wrap gap-3">
          {/* Nav links */}
          <nav className="flex items-center gap-1 flex-wrap">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `btn-press px-3 py-1.5 text-[13px] font-medium no-underline border-b-2 ${
                    isActive
                      ? "border-[var(--text-primary)] text-[var(--text-primary)]"
                      : "border-transparent text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:border-[var(--border-primary)]"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Right side: stats + wallet */}
          <div className="flex items-center gap-5">
            <div className="hidden sm:flex items-center gap-4 text-[12px] text-[var(--text-tertiary)]">
              <span>
                <span className="font-medium tabular-nums text-[var(--text-secondary)]">{taskCount != null ? String(taskCount) : "-"}</span> tasks
              </span>
              <span className="text-[var(--border-primary)]">|</span>
              <span>
                <span className="font-medium tabular-nums text-[var(--text-secondary)]">{jurorPoolSize != null ? String(jurorPoolSize) : "-"}</span> jurors
              </span>
              <span className="text-[var(--border-primary)]">|</span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--success)]" />
                Base Sepolia
              </span>
            </div>

            <ConnectButton.Custom>
              {({ account, chain, openConnectModal, openAccountModal, mounted }) => {
                if (!mounted) return null;
                if (!account) {
                  return (
                    <button
                      onClick={openConnectModal}
                      className="btn-press cursor-pointer border border-[var(--text-primary)] bg-[var(--text-primary)] text-[var(--bg-primary)] px-4 py-1.5 text-[13px] font-medium hover:bg-[var(--accent-hover)]"
                    >
                      Connect Wallet
                    </button>
                  );
                }
                return (
                  <button
                    onClick={openAccountModal}
                    className="btn-press cursor-pointer border border-[var(--border-primary)] bg-transparent text-[var(--text-primary)] px-3 py-1.5 text-[12px] font-mono hover:border-[var(--text-primary)]"
                  >
                    {account.displayName}
                    {chain?.name ? ` · ${chain.name}` : ""}
                  </button>
                );
              }}
            </ConnectButton.Custom>
          </div>
        </div>
      </div>

      {/* Thin rule */}
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <hr className="rule" />
      </div>
    </header>
  );
}
