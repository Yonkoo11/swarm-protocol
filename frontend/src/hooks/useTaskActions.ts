import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { swarmCoordinatorAbi } from "../lib/abi";
import { SWARM_COORDINATOR_ADDRESS } from "../lib/constants";

function useContractAction() {
  const { writeContract, data: hash, isPending, error, reset } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });
  return { writeContract, hash, isPending, isConfirming, isSuccess, error, reset };
}

export function useCreateTask() {
  const action = useContractAction();

  function createTask(
    reward: bigint,
    bondRequired: bigint,
    descriptionHash: string,
    deadline: bigint,
    parentTaskId: bigint,
  ) {
    action.writeContract({
      address: SWARM_COORDINATOR_ADDRESS,
      abi: swarmCoordinatorAbi,
      functionName: "createTask",
      args: [reward, bondRequired, descriptionHash, deadline, parentTaskId],
    });
  }

  return { createTask, ...action };
}

export function useClaimTask() {
  const action = useContractAction();

  function claimTask(taskId: bigint) {
    action.writeContract({
      address: SWARM_COORDINATOR_ADDRESS,
      abi: swarmCoordinatorAbi,
      functionName: "claimTask",
      args: [taskId],
    });
  }

  return { claimTask, ...action };
}

export function useSubmitWork() {
  const action = useContractAction();

  function submitWork(taskId: bigint, proofHash: string) {
    action.writeContract({
      address: SWARM_COORDINATOR_ADDRESS,
      abi: swarmCoordinatorAbi,
      functionName: "submitWork",
      args: [taskId, proofHash],
    });
  }

  return { submitWork, ...action };
}

export function useApproveWork() {
  const action = useContractAction();

  function approveWork(taskId: bigint) {
    action.writeContract({
      address: SWARM_COORDINATOR_ADDRESS,
      abi: swarmCoordinatorAbi,
      functionName: "approveWork",
      args: [taskId],
    });
  }

  return { approveWork, ...action };
}

export function useCancelTask() {
  const action = useContractAction();

  function cancelTask(taskId: bigint) {
    action.writeContract({
      address: SWARM_COORDINATOR_ADDRESS,
      abi: swarmCoordinatorAbi,
      functionName: "cancelTask",
      args: [taskId],
    });
  }

  return { cancelTask, ...action };
}
