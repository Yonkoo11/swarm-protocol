import { useState } from "react";
import { useAccount } from "wagmi";
import { useAllTasks } from "../hooks/useSwarmCoordinator";
import { TaskCard } from "../components/tasks/TaskCard";

export function MyTasksPage() {
  const { address } = useAccount();
  const { tasks, isLoading } = useAllTasks();
  const [tab, setTab] = useState<"created" | "assigned">("created");

  if (!address) {
    return <p className="text-[var(--text-secondary)]">Connect your wallet to see your tasks.</p>;
  }

  if (isLoading) {
    return <p className="text-[var(--text-secondary)]">Loading...</p>;
  }

  const created = tasks.filter((t) => t.creator.toLowerCase() === address.toLowerCase());
  const assigned = tasks.filter((t) => t.assignee.toLowerCase() === address.toLowerCase());

  const active = tab === "created" ? created : assigned;

  return (
    <div className="flex flex-col gap-4">
      <h2 className="m-0 text-2xl font-bold">My Tasks</h2>
      <div className="flex gap-2">
        <TabButton active={tab === "created"} onClick={() => setTab("created")}>
          Created ({created.length})
        </TabButton>
        <TabButton active={tab === "assigned"} onClick={() => setTab("assigned")}>
          Assigned ({assigned.length})
        </TabButton>
      </div>
      {active.length === 0 ? (
        <p className="text-sm text-[var(--text-secondary)]">
          No tasks found. {tab === "created" ? "Create one!" : "Claim one!"}
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {active.map((task) => (
            <TaskCard key={task.id.toString()} task={task} />
          ))}
        </div>
      )}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
        active
          ? "border-[var(--accent)] bg-[var(--accent)]/15 text-[var(--accent)]"
          : "border-[var(--border-color)] bg-transparent text-[var(--text-secondary)] hover:border-[var(--accent)]/40"
      }`}
    >
      {children}
    </button>
  );
}
