import { NavLink } from "react-router-dom";

const links = [
  { to: "/tasks", label: "Tasks", icon: "📋" },
  { to: "/create", label: "Create Task", icon: "+" },
  { to: "/my-tasks", label: "My Tasks", icon: "👤" },
  { to: "/disputes", label: "Disputes", icon: "⚖️" },
  { to: "/juror", label: "Juror Pool", icon: "🏛" },
];

export function Sidebar() {
  return (
    <nav className="flex w-52 shrink-0 flex-col gap-1 border-r border-[var(--border-color)] bg-[var(--bg-secondary)] p-3">
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) =>
            `flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors no-underline ${
              isActive
                ? "bg-[var(--accent)]/15 text-[var(--accent)]"
                : "text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]"
            }`
          }
        >
          <span className="text-base">{link.icon}</span>
          {link.label}
        </NavLink>
      ))}
    </nav>
  );
}
