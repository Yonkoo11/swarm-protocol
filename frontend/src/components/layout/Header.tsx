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
      {/* Top thin rule */}
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 pt-4">
        <hr className="rule" />
      </div>

      {/* Masthead */}
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-5 text-center">
        <p className="m-0 text-[10px] uppercase tracking-[0.25em] text-[var(--text-tertiary)] mb-3 font-medium">
          Decentralised Task Protocol on Base
        </p>
        <h1 className="m-0 text-5xl md:text-7xl tracking-[-0.02em] text-[var(--text-primary)] leading-none">
          HiveMind
        </h1>
        <p className="m-0 text-[11px] text-[var(--text-tertiary)] mt-3 italic">
          {today}
        </p>
      </div>

      {/* Double rule */}
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <hr className="rule--double" />
      </div>

      {/* Nav + Stats + Wallet row */}
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-2.5">
        <div className="flex items-center justify-between gap-3">
          {/* Nav links */}
          <nav className="flex items-center gap-0 flex-wrap">
            {navLinks.map((link, i) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `btn-press px-3 sm:px-4 py-2 text-[12px] sm:text-[13px] no-underline border-b-2 ${
                    i > 0 ? "border-l border-l-[var(--border-primary)]" : ""
                  } ${
                    isActive
                      ? "border-b-[var(--text-primary)] text-[var(--text-primary)] font-semibold"
                      : "border-b-transparent text-[var(--text-tertiary)] font-medium hover:text-[var(--text-primary)]"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Right side: stats + wallet */}
          <div className="flex items-center gap-5 shrink-0">
            <div className="hidden md:flex items-center gap-4 text-[11px] text-[var(--text-tertiary)]">
              <span>
                <span className="font-semibold tabular-nums text-[var(--text-primary)] text-[13px]">{taskCount != null ? String(taskCount) : "0"}</span>
                <span className="ml-1">tasks</span>
              </span>
              <span className="text-[var(--border-primary)]">/</span>
              <span>
                <span className="font-semibold tabular-nums text-[var(--text-primary)] text-[13px]">{jurorPoolSize != null ? String(jurorPoolSize) : "0"}</span>
                <span className="ml-1">jurors</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="pulse-dot h-[6px] w-[6px] rounded-full bg-[var(--success)]" />
                <span className="text-[var(--success)] font-medium">Live</span>
              </span>
            </div>

            <ConnectButton.Custom>
              {({ account, openConnectModal, openAccountModal, mounted }) => {
                if (!mounted) return null;
                if (!account) {
                  return (
                    <button
                      onClick={openConnectModal}
                      className="btn-press cursor-pointer border-2 border-[var(--text-primary)] bg-[var(--text-primary)] text-[var(--bg-primary)] px-4 sm:px-5 py-1.5 text-[12px] sm:text-[13px] font-semibold uppercase tracking-wider hover:bg-transparent hover:text-[var(--text-primary)]"
                    >
                      Connect
                    </button>
                  );
                }
                return (
                  <button
                    onClick={openAccountModal}
                    className="btn-press cursor-pointer border border-[var(--border-primary)] bg-transparent text-[var(--text-primary)] px-3 py-1.5 text-[12px] font-mono hover:border-[var(--text-primary)]"
                  >
                    {account.displayName}
                  </button>
                );
              }}
            </ConnectButton.Custom>
          </div>
        </div>
      </div>

      {/* Bottom thin rule */}
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <hr className="rule" />
      </div>
    </header>
  );
}
