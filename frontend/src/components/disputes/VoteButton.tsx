import { useEffect } from "react";
import { useCastVote } from "../../hooks/useDisputeActions";
import { TxButton } from "../common/TxButton";

interface VoteButtonProps {
  disputeId: bigint;
  inFavorOfAssignee: boolean;
  onSuccess: () => void;
}

export function VoteButton({ disputeId, inFavorOfAssignee, onSuccess }: VoteButtonProps) {
  const { castVote, isPending, isConfirming, isSuccess, error } = useCastVote();

  useEffect(() => {
    if (isSuccess) onSuccess();
  }, [isSuccess, onSuccess]);

  return (
    <TxButton
      onClick={() => castVote(disputeId, inFavorOfAssignee)}
      isPending={isPending}
      isConfirming={isConfirming}
      isSuccess={isSuccess}
      error={error}
      variant={inFavorOfAssignee ? "primary" : "danger"}
      successMessage="Vote cast!"
    >
      {inFavorOfAssignee ? "Vote: Worker Did Good Work" : "Vote: Creator Is Right"}
    </TxButton>
  );
}
