import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { useCreateTask } from "../../hooks/useTaskActions";
import { useUsdcApproval } from "../../hooks/useUsdcApproval";
import { useUsdcBalance, useUsdcAllowance } from "../../hooks/useSwarmCoordinator";
import { parseUsdc, formatUsdc } from "../../lib/formatters";
import { TxButton } from "../common/TxButton";

export function CreateTaskForm() {
  const { address } = useAccount();
  const [reward, setReward] = useState("");
  const [bond, setBond] = useState("");
  const [description, setDescription] = useState("");
  const [deadlineDays, setDeadlineDays] = useState("7");
  const [parentTaskId, setParentTaskId] = useState("");
  const [step, setStep] = useState<"approve" | "create">("approve");

  const rewardAmount = reward ? parseUsdc(reward) : 0n;
  const bondAmount = bond ? parseUsdc(bond) : 0n;
  const totalNeeded = rewardAmount; // creator only pays reward; claimer pays bond

  const { data: balance } = useUsdcBalance(address);
  const { data: allowance, refetch: refetchAllowance } = useUsdcAllowance(address);
  const approval = useUsdcApproval();
  const create = useCreateTask();

  const hasAllowance = (allowance ?? 0n) >= totalNeeded && totalNeeded > 0n;

  useEffect(() => {
    if (hasAllowance) setStep("create");
  }, [hasAllowance]);

  useEffect(() => {
    if (approval.isSuccess) {
      refetchAllowance();
      approval.reset();
      setStep("create");
    }
  }, [approval.isSuccess, refetchAllowance]);

  function handleApprove() {
    approval.approve(totalNeeded);
  }

  function handleCreate() {
    const days = Math.max(1, Number(deadlineDays) || 7);
    const deadline = BigInt(Math.floor(Date.now() / 1000) + days * 86400);
    let parent = 0n;
    try { parent = BigInt(parentTaskId || "0"); } catch { /* default 0 */ }
    create.createTask(rewardAmount, bondAmount, description, deadline, parent);
  }

  if (!address) {
    return <p className="text-[var(--text-secondary)]">Connect your wallet to create a task.</p>;
  }

  return (
    <div className="flex flex-col gap-5 max-w-lg">
      <div className="flex flex-col gap-1">
        <label className="text-sm text-[var(--text-secondary)]">Reward (USDC)</label>
        <input
          type="text"
          value={reward}
          onChange={(e) => setReward(e.target.value)}
          placeholder="10"
          className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-tertiary)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)]"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm text-[var(--text-secondary)]">Bond Required (USDC)</label>
        <input
          type="text"
          value={bond}
          onChange={(e) => setBond(e.target.value)}
          placeholder="5"
          className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-tertiary)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)]"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm text-[var(--text-secondary)]">Description / IPFS Hash</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Task description or IPFS hash"
          rows={3}
          className="resize-none rounded-lg border border-[var(--border-color)] bg-[var(--bg-tertiary)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)]"
        />
      </div>

      <div className="flex gap-4">
        <div className="flex flex-1 flex-col gap-1">
          <label className="text-sm text-[var(--text-secondary)]">Deadline (days from now)</label>
          <input
            type="number"
            value={deadlineDays}
            onChange={(e) => setDeadlineDays(e.target.value)}
            min="1"
            className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-tertiary)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)]"
          />
        </div>
        <div className="flex flex-1 flex-col gap-1">
          <label className="text-sm text-[var(--text-secondary)]">Parent Task ID (optional)</label>
          <input
            type="text"
            value={parentTaskId}
            onChange={(e) => setParentTaskId(e.target.value)}
            placeholder="0"
            className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-tertiary)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)]"
          />
        </div>
      </div>

      {balance !== undefined && (
        <p className="text-xs text-[var(--text-secondary)] m-0">
          Balance: {formatUsdc(balance)} USDC
          {allowance !== undefined && ` | Allowance: ${formatUsdc(allowance)} USDC`}
        </p>
      )}

      {/* Step indicators */}
      <div className="flex gap-3 items-center text-sm">
        <StepIndicator active={step === "approve"} done={hasAllowance} label="1. Approve USDC" />
        <span className="text-[var(--border-color)]">&rarr;</span>
        <StepIndicator active={step === "create"} done={create.isSuccess} label="2. Create Task" />
      </div>

      {step === "approve" && !hasAllowance ? (
        <TxButton
          onClick={handleApprove}
          isPending={approval.isPending}
          isConfirming={approval.isConfirming}
          isSuccess={approval.isSuccess}
          error={approval.error}
          disabled={totalNeeded === 0n}
          successMessage="USDC approved!"
        >
          Approve {reward ? `${reward} USDC` : "USDC"}
        </TxButton>
      ) : (
        <TxButton
          onClick={handleCreate}
          isPending={create.isPending}
          isConfirming={create.isConfirming}
          isSuccess={create.isSuccess}
          error={create.error}
          disabled={!description || rewardAmount === 0n}
          successMessage="Task created!"
        >
          Create Task
        </TxButton>
      )}
    </div>
  );
}

function StepIndicator({ active, done, label }: { active: boolean; done: boolean; label: string }) {
  return (
    <span
      className={`text-xs font-medium ${
        done
          ? "text-emerald-400"
          : active
            ? "text-[var(--accent)]"
            : "text-[var(--text-secondary)]"
      }`}
    >
      {done ? "✓ " : ""}{label}
    </span>
  );
}
