import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { useClaimTask } from "../../hooks/useTaskActions";
import { useUsdcApproval } from "../../hooks/useUsdcApproval";
import { useUsdcAllowance } from "../../hooks/useSwarmCoordinator";
import { formatUsdc } from "../../lib/formatters";
import { TxButton } from "../common/TxButton";

interface ClaimButtonProps {
  taskId: bigint;
  bondAmount: bigint;
  onSuccess: () => void;
}

export function ClaimButton({ taskId, bondAmount, onSuccess }: ClaimButtonProps) {
  const { address } = useAccount();
  const { data: allowance, refetch: refetchAllowance } = useUsdcAllowance(address);
  const approval = useUsdcApproval();
  const claim = useClaimTask();
  const [step, setStep] = useState<"approve" | "claim">("approve");

  const hasAllowance = (allowance ?? 0n) >= bondAmount;

  useEffect(() => {
    if (hasAllowance) setStep("claim");
  }, [hasAllowance]);

  useEffect(() => {
    if (approval.isSuccess) {
      refetchAllowance();
      approval.reset();
      setStep("claim");
    }
  }, [approval.isSuccess, refetchAllowance]);

  useEffect(() => {
    if (claim.isSuccess) onSuccess();
  }, [claim.isSuccess, onSuccess]);

  if (step === "approve" && !hasAllowance) {
    return (
      <TxButton
        onClick={() => approval.approve(bondAmount)}
        isPending={approval.isPending}
        isConfirming={approval.isConfirming}
        isSuccess={approval.isSuccess}
        error={approval.error}
      >
        Approve {formatUsdc(bondAmount)} USDC Bond
      </TxButton>
    );
  }

  return (
    <TxButton
      onClick={() => claim.claimTask(taskId)}
      isPending={claim.isPending}
      isConfirming={claim.isConfirming}
      isSuccess={claim.isSuccess}
      error={claim.error}
      successMessage="Task claimed!"
    >
      Claim Task (Bond: {formatUsdc(bondAmount)} USDC)
    </TxButton>
  );
}
