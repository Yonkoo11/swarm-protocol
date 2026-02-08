import { useEffect } from "react";
import { useCancelTask } from "../../hooks/useTaskActions";
import { TxButton } from "../common/TxButton";

interface CancelButtonProps {
  taskId: bigint;
  onSuccess: () => void;
}

export function CancelButton({ taskId, onSuccess }: CancelButtonProps) {
  const { cancelTask, isPending, isConfirming, isSuccess, error } = useCancelTask();

  useEffect(() => {
    if (isSuccess) onSuccess();
  }, [isSuccess, onSuccess]);

  return (
    <TxButton
      onClick={() => cancelTask(taskId)}
      isPending={isPending}
      isConfirming={isConfirming}
      isSuccess={isSuccess}
      error={error}
      variant="danger"
      successMessage="Task cancelled. USDC refunded."
    >
      Cancel Task
    </TxButton>
  );
}
