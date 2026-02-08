import { Link } from "react-router-dom";
import { Reveal } from "../components/common/Reveal";
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

const METRICS = [
  { value: "1%", label: "Platform Fee", desc: "On completed tasks only" },
  { value: "2%", label: "Jury Fee", desc: "Split among 3 jurors" },
  { value: "3", label: "Jurors per Dispute", desc: "Randomly selected" },
  { value: "0", label: "Fee on Cancellation", desc: "Risk-free posting" },
];

const FAQ = [
  {
    q: "What happens if the worker doesn't deliver?",
    a: "The task deadline expires and the creator can cancel, reclaiming their full USDC reward from escrow.",
  },
  {
    q: "How are jurors selected?",
    a: "Three jurors are pseudo-randomly selected from the registered juror pool. Each juror stakes a small bond and votes independently.",
  },
  {
    q: "Can I decompose a task into sub-tasks?",
    a: "Yes. Assignees can create child tasks funded from their own USDC. The difference between the parent reward and sub-task costs is the coordinator's fee.",
  },
  {
    q: "What tokens are supported?",
    a: "USDC only. Stable settlement removes price volatility from the coordination layer. CCTP-ready for future cross-chain expansion.",
  },
  {
    q: "Is my reward safe in escrow?",
    a: "Yes. USDC is held by the smart contract with ReentrancyGuard protection. Only the approval or dispute flow can release funds.",
  },
  {
    q: "What's the minimum reward?",
    a: "Any amount of USDC. The protocol takes a 1% fee on completion, so extremely small tasks may not be economical.",
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

      {/* How It Works */}
      <hr className="rule" />
      <Reveal>
        <div className="flex flex-col gap-6 py-4">
          <div>
            <h2 className="m-0 text-2xl md:text-3xl">How It Works</h2>
            <p className="m-0 mt-1.5 text-sm text-[var(--text-tertiary)] italic">
              Trustless task coordination in four steps.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((step, i) => (
              <Reveal key={step.num} delay={i * 100}>
                <div className="border border-[var(--border-primary)] p-5 flex flex-col gap-3">
                  <span className="headline text-3xl text-[var(--text-primary)]">{step.num}</span>
                  <h3 className="m-0 text-sm font-semibold text-[var(--text-primary)]">{step.title}</h3>
                  <p className="m-0 text-sm text-[var(--text-secondary)] leading-relaxed">{step.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Reveal>

      {/* The Protocol */}
      <hr className="rule" />
      <Reveal>
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
      </Reveal>

      {/* By the Numbers */}
      <hr className="rule" />
      <Reveal>
        <div className="flex flex-col gap-6 py-4">
          <div>
            <h2 className="m-0 text-2xl md:text-3xl">By the Numbers</h2>
            <p className="m-0 mt-1.5 text-sm text-[var(--text-tertiary)] italic">
              Protocol metrics, live from the blockchain.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {METRICS.map((s) => (
              <div key={s.label} className="border border-[var(--border-primary)] p-5 flex flex-col gap-2">
                <span className="headline text-3xl md:text-4xl text-[var(--text-primary)]">{s.value}</span>
                <span className="section-label">{s.label}</span>
                <p className="m-0 text-xs text-[var(--text-tertiary)]">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* FAQ */}
      <hr className="rule" />
      <Reveal>
        <div className="flex flex-col gap-6 py-4">
          <div>
            <h2 className="m-0 text-2xl md:text-3xl">Common Questions</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
            {FAQ.map((faq) => (
              <div key={faq.q} className="flex flex-col gap-1.5">
                <h3 className="m-0 text-sm font-semibold text-[var(--text-primary)]">{faq.q}</h3>
                <p className="m-0 text-sm text-[var(--text-secondary)] leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* Built on Base */}
      <hr className="rule--double" />
      <Reveal>
        <div className="py-8 text-center flex flex-col items-center gap-3">
          <span className="section-label">Deployed on</span>
          <span className="headline text-2xl">Base Sepolia</span>
          <p className="m-0 text-sm text-[var(--text-tertiary)] max-w-md">
            Secured by Ethereum. Settled in USDC. Open source and verifiable.
          </p>
          <a
            href="https://base-sepolia.blockscout.com/address/0xec8419C9F4509d5e83E4329721cFCb9f27f6B649"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 text-xs font-mono text-[var(--text-tertiary)] hover:text-[var(--text-primary)] no-underline transition-colors"
          >
            View Contract on Blockscout
          </a>
        </div>
      </Reveal>
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
