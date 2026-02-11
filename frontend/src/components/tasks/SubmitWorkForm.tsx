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
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div className="form-group">
        <label className="form-label">Proof of Work</label>
        <input
          type="text"
          value={proofHash}
          onChange={(e) => setProofHash(e.target.value)}
          placeholder="IPFS CID, commit SHA, etc."
          className="form-input"
        />
      </div>
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
