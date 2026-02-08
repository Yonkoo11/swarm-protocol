import { useEffect } from "react";
import { useApproveWork } from "../../hooks/useTaskActions";
import { TxButton } from "../common/TxButton";

interface ApproveButtonProps {
  taskId: bigint;
  onSuccess: () => void;
}

export function ApproveButton({ taskId, onSuccess }: ApproveButtonProps) {
  const { approveWork, isPending, isConfirming, isSuccess, error } = useApproveWork();

  useEffect(() => {
    if (isSuccess) onSuccess();
  }, [isSuccess]);

  return (
    <TxButton
      onClick={() => approveWork(taskId)}
      isPending={isPending}
      isConfirming={isConfirming}
      isSuccess={isSuccess}
      error={error}
      successMessage="Work approved! Payment released."
    >
      Approve Work
    </TxButton>
  );
}
