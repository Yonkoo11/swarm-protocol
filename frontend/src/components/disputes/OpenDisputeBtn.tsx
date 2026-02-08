import { useEffect } from "react";
import { useOpenDispute } from "../../hooks/useDisputeActions";
import { TxButton } from "../common/TxButton";

interface OpenDisputeBtnProps {
  taskId: bigint;
  onSuccess: () => void;
}

export function OpenDisputeBtn({ taskId, onSuccess }: OpenDisputeBtnProps) {
  const { openDispute, isPending, isConfirming, isSuccess, error } = useOpenDispute();

  useEffect(() => {
    if (isSuccess) onSuccess();
  }, [isSuccess, onSuccess]);

  return (
    <TxButton
      onClick={() => openDispute(taskId)}
      isPending={isPending}
      isConfirming={isConfirming}
      isSuccess={isSuccess}
      error={error}
      variant="danger"
      successMessage="Dispute opened!"
    >
      Open Dispute
    </TxButton>
  );
}
