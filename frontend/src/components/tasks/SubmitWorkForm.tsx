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
    <div className="flex flex-col gap-3">
      <input
        type="text"
        value={proofHash}
        onChange={(e) => setProofHash(e.target.value)}
        placeholder="Proof hash (IPFS CID, commit SHA, etc.)"
        className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-tertiary)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)] w-full"
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
