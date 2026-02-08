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
  const totalNeeded = rewardAmount;

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
    return (
      <div className="flex flex-col items-center gap-3 border border-dashed border-[var(--border-primary)] py-12 text-center">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        <p className="m-0 text-sm text-[var(--text-tertiary)]">Connect your wallet to create a task.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 max-w-lg">
      <FormField label="Reward (USDC)" hint="Minimum 1 USDC">
        <input
          type="text"
          value={reward}
          onChange={(e) => setReward(e.target.value)}
          placeholder="10"
          className="w-full border border-[var(--border-primary)] bg-white px-3 py-2.5 text-[var(--text-primary)] outline-none focus:border-[var(--text-primary)] focus:ring-1 focus:ring-[var(--text-primary)]"
        />
      </FormField>

      <FormField label="Bond Required (USDC)" hint="Workers stake this as quality guarantee">
        <input
          type="text"
          value={bond}
          onChange={(e) => setBond(e.target.value)}
          placeholder="5"
          className="w-full border border-[var(--border-primary)] bg-white px-3 py-2.5 text-[var(--text-primary)] outline-none focus:border-[var(--text-primary)] focus:ring-1 focus:ring-[var(--text-primary)]"
        />
      </FormField>

      <FormField label="Description" hint="Task details or IPFS hash">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe what needs to be done..."
          rows={3}
          className="w-full resize-none border border-[var(--border-primary)] bg-white px-3 py-2.5 text-[var(--text-primary)] outline-none focus:border-[var(--text-primary)] focus:ring-1 focus:ring-[var(--text-primary)]"
        />
      </FormField>

      <div className="flex gap-4">
        <FormField label="Deadline (days)" className="flex-1">
          <input
            type="number"
            value={deadlineDays}
            onChange={(e) => setDeadlineDays(e.target.value)}
            min="1"
            className="w-full border border-[var(--border-primary)] bg-white px-3 py-2.5 text-[var(--text-primary)] outline-none focus:border-[var(--text-primary)] focus:ring-1 focus:ring-[var(--text-primary)]"
          />
        </FormField>
        <FormField label="Parent Task ID" hint="Optional" className="flex-1">
          <input
            type="text"
            value={parentTaskId}
            onChange={(e) => setParentTaskId(e.target.value)}
            placeholder="0"
            className="w-full border border-[var(--border-primary)] bg-white px-3 py-2.5 text-[var(--text-primary)] outline-none focus:border-[var(--text-primary)] focus:ring-1 focus:ring-[var(--text-primary)]"
          />
        </FormField>
      </div>

      {balance !== undefined && (
        <div className="flex items-center gap-3 bg-[var(--bg-tertiary)] px-3 py-2 text-xs">
          <span className="text-[var(--text-tertiary)]">Balance:</span>
          <span className="tabular-nums font-mono text-[var(--text-secondary)]">{formatUsdc(balance)} USDC</span>
          {allowance !== undefined && (
            <>
              <span className="text-[var(--border-primary)]">|</span>
              <span className="text-[var(--text-tertiary)]">Approved:</span>
              <span className="tabular-nums font-mono text-[var(--text-secondary)]">{formatUsdc(allowance)} USDC</span>
            </>
          )}
        </div>
      )}

      {/* Step indicators */}
      <div className="flex gap-4 items-center">
        <StepIndicator step={1} active={step === "approve"} done={hasAllowance} label="Approve USDC" />
        <div className="h-px flex-1 bg-[var(--border-primary)]" />
        <StepIndicator step={2} active={step === "create"} done={create.isSuccess} label="Create Task" />
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

function FormField({
  label,
  hint,
  children,
  className = "",
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <div className="flex items-baseline justify-between">
        <label className="text-sm font-medium text-[var(--text-secondary)]">{label}</label>
        {hint && <span className="text-[11px] text-[var(--text-tertiary)]">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

function StepIndicator({ step, active, done, label }: { step: number; active: boolean; done: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={`flex h-6 w-6 items-center justify-center text-xs font-semibold ${
          done
            ? "bg-[var(--success-muted)] text-[var(--success)]"
            : active
              ? "bg-[var(--accent-muted)] text-[var(--text-primary)]"
              : "bg-[var(--bg-tertiary)] text-[var(--text-tertiary)]"
        }`}
      >
        {done ? (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : (
          step
        )}
      </span>
      <span
        className={`text-xs font-medium ${
          done ? "text-[var(--success)]" : active ? "text-[var(--accent)]" : "text-[var(--text-tertiary)]"
        }`}
      >
        {label}
      </span>
    </div>
  );
}
