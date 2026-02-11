import { ConnectButton } from "@rainbow-me/rainbowkit";
import { truncateAddress } from "../../lib/formatters";

export function Header() {
  return (
    <header className="header">
      <div className="honeycomb-mesh">
        <svg viewBox="0 0 500 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <pattern id="hexMesh" x="0" y="0" width="30" height="52" patternUnits="userSpaceOnUse">
            <path d="M15 0L30 9V27L15 36L0 27V9Z" fill="none" stroke="#E8A317" strokeWidth="0.5" />
            <path d="M15 16L30 25V43L15 52L0 43V25Z" fill="none" stroke="#E8A317" strokeWidth="0.5" />
          </pattern>
          <rect width="500" height="80" fill="url(#hexMesh)" />
        </svg>
      </div>

      <div className="header-brand">
        <div className="header-logo">
          <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 2L32 10V26L18 34L4 26V10Z" fill="none" stroke="rgba(232,163,23,0.2)" strokeWidth="0.75" />
            <path d="M18 5.5L29 12V24L18 30.5L7 24V12Z" fill="none" stroke="rgba(232,163,23,0.4)" strokeWidth="1" />
            <defs>
              <linearGradient id="hexGrad" x1="18" y1="9" x2="18" y2="27" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#F5C842" />
                <stop offset="100%" stopColor="#D4941A" />
              </linearGradient>
            </defs>
            <path d="M18 9L26 14V22L18 27L10 22V14Z" fill="url(#hexGrad)" />
            <path d="M18 13L22 15.5V20.5L18 23L14 20.5V15.5Z" fill="#141210" opacity="0.3" />
          </svg>
        </div>
        <span className="header-title">HiveMind</span>
      </div>

      <ConnectButton.Custom>
        {({ account, openConnectModal, openAccountModal, mounted }) => {
          if (!mounted) return null;
          if (!account) {
            return (
              <button className="wallet-chip" onClick={openConnectModal}>
                <span className="wallet-dot" />
                <span>Connect</span>
              </button>
            );
          }
          return (
            <button className="wallet-chip" onClick={openAccountModal}>
              <span className="wallet-dot" />
              <span>{account.displayName ?? truncateAddress(account.address)}</span>
            </button>
          );
        }}
      </ConnectButton.Custom>
    </header>
  );
}
