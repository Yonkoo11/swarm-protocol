import { useState } from "react";
import { useAccount } from "wagmi";
import { useAllTasks } from "../hooks/useSwarmCoordinator";
import { TaskCard } from "../components/tasks/TaskCard";
import { TaskStatus } from "../lib/constants";

export function MyTasksPage() {
  const { address } = useAccount();
  const { tasks, isLoading } = useAllTasks();
  const [tab, setTab] = useState<"created" | "assigned">("created");

  if (!address) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="m-0 text-2xl md:text-3xl">My Tasks</h2>
          <p className="m-0 mt-1.5 text-sm text-[var(--text-tertiary)] italic">Track tasks you created or claimed.</p>
        </div>
        <div className="flex flex-col items-center gap-3 border border-dashed border-[var(--border-primary)] py-12 text-center">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <p className="m-0 text-sm text-[var(--text-tertiary)]">Connect your wallet to see your tasks.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="m-0 text-2xl md:text-3xl">My Tasks</h2>
        </div>
        <div className="flex flex-col gap-3">
          {[1, 2].map((i) => (
            <div key={i} className="skeleton h-24 w-full" />
          ))}
        </div>
      </div>
    );
  }

  const addr = address.toLowerCase();
  const created = tasks.filter((t) => t.creator.toLowerCase() === addr);
  const assigned = tasks.filter((t) => t.assignee.toLowerCase() === addr);
  const completed = tasks.filter(
    (t) =>
      t.status === TaskStatus.Completed &&
      (t.creator.toLowerCase() === addr || t.assignee.toLowerCase() === addr)
  );
  const active = tab === "created" ? created : assigned;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="m-0 text-2xl md:text-3xl">My Tasks</h2>
        <p className="m-0 mt-1.5 text-sm text-[var(--text-tertiary)] italic">Track tasks you created or claimed.</p>
      </div>

      {(created.length > 0 || assigned.length > 0) && (
        <>
          <p className="section-label m-0">
            <span className="font-semibold tabular-nums">{created.length}</span> created,{" "}
            <span className="font-semibold tabular-nums">{assigned.length}</span> assigned,{" "}
            <span className="font-semibold tabular-nums">{completed.length}</span> completed
          </p>
          <hr className="rule" />
        </>
      )}

      <div className="flex gap-0 border-b border-[var(--border-primary)]">
        <TabButton active={tab === "created"} onClick={() => setTab("created")}>
          Created ({created.length})
        </TabButton>
        <TabButton active={tab === "assigned"} onClick={() => setTab("assigned")}>
          Assigned ({assigned.length})
        </TabButton>
      </div>

      {active.length === 0 ? (
        <div className="flex flex-col items-center gap-3 border border-dashed border-[var(--border-primary)] py-12 text-center">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          <p className="m-0 text-sm text-[var(--text-tertiary)]">
            {tab === "created" ? "You haven't created any tasks yet." : "You haven't claimed any tasks yet."}
          </p>
          <a
            href={tab === "created" ? "/create" : "/tasks"}
            className="btn-press inline-flex items-center gap-1.5 bg-[var(--text-primary)] px-3 py-1.5 text-xs font-medium text-[var(--bg-primary)] no-underline hover:bg-[var(--accent-hover)]"
          >
            {tab === "created" ? "Create a task" : "Browse tasks"}
          </a>
        </div>
      ) : (
        <div className="flex flex-col">
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
      className={`btn-press flex-1 px-3 py-1.5 text-xs font-medium cursor-pointer border-0 bg-transparent ${
        active
          ? "border-b-2 border-[var(--text-primary)] text-[var(--text-primary)]"
          : "border-b-2 border-transparent text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
      }`}
    >
      {children}
    </button>
  );
}
