export type TabId = "feed" | "post" | "mine" | "jury";

interface TabBarProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

const tabs: { id: TabId; label: string; icon: JSX.Element }[] = [
  {
    id: "feed",
    label: "Feed",
    icon: (
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 2L16 5.5V12.5L10 16L4 12.5V5.5Z"/>
        <path d="M10 2V8M16 5.5L10 8M4 5.5L10 8"/>
        <line x1="4" y1="12.5" x2="10" y2="16"/>
        <line x1="16" y1="12.5" x2="10" y2="16"/>
      </svg>
    ),
  },
  {
    id: "post",
    label: "Post",
    icon: (
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 3L17 7V13L10 17L3 13V7Z"/>
        <line x1="10" y1="8" x2="10" y2="12"/>
        <line x1="8" y1="10" x2="12" y2="10"/>
      </svg>
    ),
  },
  {
    id: "mine",
    label: "Mine",
    icon: (
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 3L17 7V13L10 17L3 13V7Z"/>
        <circle cx="10" cy="8.5" r="2"/>
        <path d="M6.5 14C6.5 11.5 8 10.5 10 10.5C12 10.5 13.5 11.5 13.5 14"/>
      </svg>
    ),
  },
  {
    id: "jury",
    label: "Jury",
    icon: (
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 3L17 7V13L10 17L3 13V7Z"/>
        <line x1="10" y1="7" x2="10" y2="14"/>
        <line x1="6.5" y1="9" x2="13.5" y2="9"/>
        <path d="M5.5 9L6.5 12H8.5L7.5 9"/>
        <path d="M12.5 9L11.5 12H13.5L14.5 9"/>
      </svg>
    ),
  },
];

export function TabBar({ activeTab, onTabChange }: TabBarProps) {
  return (
    <nav className="tab-bar">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`tab-btn${activeTab === tab.id ? " active" : ""}`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.icon}
          <span className="tab-btn-label">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}
