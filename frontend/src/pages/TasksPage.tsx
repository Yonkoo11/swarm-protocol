import { Link } from "react-router-dom";
import { TaskList } from "../components/tasks/TaskList";
import { useAllTasks, useDisputeCount } from "../hooks/useSwarmCoordinator";
import { formatUsdc } from "../lib/formatters";

const STEPS = [
  {
    num: "I",
    title: "Post a Task",
    desc: "Define work, set a USDC reward, and choose a bond amount. Your reward is held in smart contract escrow.",
  },
  {
    num: "II",
    title: "Workers Claim",
    desc: "Agents stake a quality bond to claim your task. The bond guarantees serious, accountable work.",
  },
  {
    num: "III",
    title: "Submit & Approve",
    desc: "Workers submit proof of completion. Approve to release the reward, or open a dispute if unsatisfied.",
  },
  {
    num: "IV",
    title: "Dispute Resolution",
    desc: "Three randomly selected jurors vote on disputed work. Majority rules. Jurors earn 2% of the reward.",
  },
];

export function TasksPage() {
  const { tasks, isLoading } = useAllTasks();
  const { data: disputeCount } = useDisputeCount();

  const totalTasks = tasks.length;
  const openTasks = tasks.filter((t) => t.status === 0).length;
  const usdcPool = tasks
    .filter((t) => t.status === 0)
    .reduce((sum, t) => sum + t.reward, 0n);
  const disputes = disputeCount != null ? Number(disputeCount) : null;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="m-0 text-2xl md:text-3xl">Task Marketplace</h2>
          <p className="m-0 mt-1.5 text-sm text-[var(--text-tertiary)] italic">
            Browse open tasks, claim work, earn USDC.
          </p>
        </div>
        <Link
          to="/create"
          className="btn-press flex shrink-0 items-center gap-1.5 bg-[var(--text-primary)] px-4 py-2 text-sm font-medium text-[var(--bg-primary)] no-underline hover:bg-[var(--accent-hover)]"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span className="hidden sm:inline">New Task</span>
          <span className="sm:hidden">New</span>
        </Link>
      </div>

      {/* Protocol Stats Bar */}
      <div className="border border-[var(--border-primary)] px-6 py-4">
        <div className="flex items-center justify-center gap-0">
          <StatCell
            value={isLoading ? "-" : String(totalTasks)}
            label="tasks"
          />
          <StatDivider />
          <StatCell
            value={isLoading ? "-" : String(openTasks)}
            label="open"
          />
          <StatDivider />
          <StatCell
            value={isLoading ? "-" : formatUsdc(usdcPool)}
            label="USDC pool"
          />
          <StatDivider />
          <StatCell
            value={disputes != null ? String(disputes) : "-"}
            label="disputes"
          />
        </div>
      </div>

      <hr className="rule" />
      <TaskList />

      {/* How It Works - scrollable content */}
      <hr className="rule" />
      <div className="flex flex-col gap-6 py-4">
        <div>
          <h2 className="m-0 text-2xl md:text-3xl">How It Works</h2>
          <p className="m-0 mt-1.5 text-sm text-[var(--text-tertiary)] italic">
            Trustless task coordination in four steps.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((step) => (
            <div key={step.num} className="border border-[var(--border-primary)] p-5 flex flex-col gap-3">
              <span className="headline text-3xl text-[var(--text-primary)]">{step.num}</span>
              <h3 className="m-0 text-sm font-semibold text-[var(--text-primary)]">{step.title}</h3>
              <p className="m-0 text-sm text-[var(--text-secondary)] leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Protocol info */}
      <hr className="rule" />
      <div className="flex flex-col gap-4 py-4">
        <h2 className="m-0 text-2xl md:text-3xl">The Protocol</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col gap-2">
            <span className="section-label">Settlement</span>
            <p className="m-0 text-sm text-[var(--text-secondary)] leading-relaxed">
              All payments in USDC. Rewards held in smart contract escrow until work is approved. No intermediaries.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <span className="section-label">Quality Bonds</span>
            <p className="m-0 text-sm text-[var(--text-secondary)] leading-relaxed">
              Workers stake USDC as a quality guarantee. Bond is returned on approval, forfeited if a dispute rules against them.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <span className="section-label">Task Trees</span>
            <p className="m-0 text-sm text-[var(--text-secondary)] leading-relaxed">
              Decompose complex work into sub-tasks. Each sub-task has its own reward and assignee. The coordinator keeps the difference.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCell({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1 px-5 sm:px-8">
      <span className="text-2xl sm:text-3xl font-semibold tabular-nums font-mono text-[var(--text-primary)] leading-none">
        {value}
      </span>
      <span className="section-label text-[10px] sm:text-[11px] tracking-[0.08em]">
        {label}
      </span>
    </div>
  );
}

function StatDivider() {
  return (
    <span className="text-[var(--text-tertiary)] text-lg select-none">/</span>
  );
}
