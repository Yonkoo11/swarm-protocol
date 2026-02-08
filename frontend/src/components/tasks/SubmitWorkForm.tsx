import { useState, useEffect } from "react";
import { useSubmitWork } from "../../hooks/useTaskActions";
import { TxButton } from "../common/TxButton";

interface SubmitWorkFormProps {
  taskId: bigint;
  onSuccess: () => void;
}

export function SubmitWorkForm({ taskId, onSuccess }: SubmitWorkFormProps) {
  const [proofHash, setProofHash] = useState("");
  const { submitWork, isPending, isConfirming, isSuccess, error } = useSubmitWork();

  useEffect(() => {
    if (isSuccess) onSuccess();
  }, [isSuccess, onSuccess]);

  return (
    <div className="flex flex-col gap-3 w-full">
      <input
        type="text"
        value={proofHash}
        onChange={(e) => setProofHash(e.target.value)}
        placeholder="Proof hash (IPFS CID, commit SHA, etc.)"
        className="w-full border border-[var(--border-primary)] bg-white px-3 py-2.5 text-[var(--text-primary)] outline-none focus:border-[var(--text-primary)] focus:ring-1 focus:ring-[var(--text-primary)]"
      />
      <TxButton
        onClick={() => submitWork(taskId, proofHash)}
        isPending={isPending}
        isConfirming={isConfirming}
        isSuccess={isSuccess}
        error={error}
        disabled={!proofHash}
        successMessage="Work submitted!"
      >
        Submit Work
      </TxButton>
    </div>
  );
}
