import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { swarmCoordinatorAbi } from "../lib/abi";
import { SWARM_COORDINATOR_ADDRESS } from "../lib/constants";

function useContractAction() {
  const { writeContract, data: hash, isPending, error, reset } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });
  return { writeContract, hash, isPending, isConfirming, isSuccess, error, reset };
}

export function useOpenDispute() {
  const action = useContractAction();

  function openDispute(taskId: bigint) {
    action.writeContract({
      address: SWARM_COORDINATOR_ADDRESS,
      abi: swarmCoordinatorAbi,
      functionName: "openDispute",
      args: [taskId],
    });
  }

  return { openDispute, ...action };
}

export function useCastVote() {
  const action = useContractAction();

  function castVote(disputeId: bigint, inFavorOfAssignee: boolean) {
    action.writeContract({
      address: SWARM_COORDINATOR_ADDRESS,
      abi: swarmCoordinatorAbi,
      functionName: "castVote",
      args: [disputeId, inFavorOfAssignee],
    });
  }

  return { castVote, ...action };
}

export function useRegisterJuror() {
  const action = useContractAction();

  function registerJuror() {
    action.writeContract({
      address: SWARM_COORDINATOR_ADDRESS,
      abi: swarmCoordinatorAbi,
      functionName: "registerJuror",
    });
  }

  return { registerJuror, ...action };
}
