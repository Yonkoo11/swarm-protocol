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
      <div className="empty-state">
        <svg className="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        <span className="empty-state-text">Connect wallet to create a task</span>
      </div>
    );
  }

  return (
    <div className="post-form">
      <div className="form-group">
        <label className="form-label">Reward (USDC)</label>
        <div className="usdc-input-wrapper">
          <input
            type="text"
            value={reward}
            onChange={(e) => setReward(e.target.value)}
            placeholder="10"
            className="form-input"
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Bond Required (USDC)</label>
        <div className="usdc-input-wrapper">
          <input
            type="text"
            value={bond}
            onChange={(e) => setBond(e.target.value)}
            placeholder="5"
            className="form-input"
          />
        </div>
        <span className="form-hint">Workers stake this as quality guarantee</span>
      </div>

      <div className="form-group">
        <label className="form-label">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe what needs to be done..."
          className="form-textarea"
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Deadline (days)</label>
          <input
            type="number"
            value={deadlineDays}
            onChange={(e) => setDeadlineDays(e.target.value)}
            min="1"
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Parent Task ID</label>
          <input
            type="text"
            value={parentTaskId}
            onChange={(e) => setParentTaskId(e.target.value)}
            placeholder="0"
            className="form-input"
          />
          <span className="form-hint">Optional</span>
        </div>
      </div>

      {balance !== undefined && (
        <div className="balance-bar">
          <span>Balance:</span>
          <span className="value">{formatUsdc(balance)} USDC</span>
          {allowance !== undefined && (
            <>
              <span className="separator">|</span>
              <span>Approved:</span>
              <span className="value">{formatUsdc(allowance)} USDC</span>
            </>
          )}
        </div>
      )}

      <div className="step-indicator">
        <div className={`step-dot ${hasAllowance ? "done" : step === "approve" ? "active" : "pending"}`}>
          {hasAllowance ? (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : "1"}
        </div>
        <span className={`step-label ${hasAllowance ? "done" : step === "approve" ? "active" : "pending"}`}>Approve</span>
        <div className="step-line" />
        <div className={`step-dot ${create.isSuccess ? "done" : step === "create" ? "active" : "pending"}`}>
          {create.isSuccess ? (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : "2"}
        </div>
        <span className={`step-label ${create.isSuccess ? "done" : step === "create" ? "active" : "pending"}`}>Create</span>
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
