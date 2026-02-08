import { useReadContract, useReadContracts } from "wagmi";
import type { Abi } from "viem";
import { swarmCoordinatorAbi, erc20Abi } from "../lib/abi";
import { SWARM_COORDINATOR_ADDRESS, USDC_ADDRESS } from "../lib/constants";
import type { Task, Dispute } from "../lib/types";

const contractConfig = {
  address: SWARM_COORDINATOR_ADDRESS,
  abi: swarmCoordinatorAbi as unknown as Abi,
} as const;

export function useTaskCount() {
  return useReadContract({
    ...contractConfig,
    functionName: "taskCount",
  });
}

export function useTask(taskId: bigint) {
  const result = useReadContract({
    ...contractConfig,
    functionName: "getTask",
    args: [taskId],
    query: { enabled: taskId > 0n },
  });
  return { ...result, data: result.data as Task | undefined };
}

export function useAllTasks() {
  const { data: taskCount } = useTaskCount();
  const count = Number(taskCount ?? 0n);

  const contracts = Array.from({ length: count }, (_, i) => ({
    ...contractConfig,
    functionName: "getTask" as const,
    args: [BigInt(i + 1)] as const,
  }));

  const result = useReadContracts({
    contracts,
    query: { enabled: count > 0 },
  });

  const tasks: Task[] = (result.data ?? [])
    .map((r) => (r.status === "success" ? (r.result as Task) : null))
    .filter((t): t is Task => t !== null);

  return { ...result, tasks };
}

export function useDispute(disputeId: bigint) {
  const result = useReadContract({
    ...contractConfig,
    functionName: "getDispute",
    args: [disputeId],
    query: { enabled: disputeId > 0n },
  });
  return { ...result, data: result.data as Dispute | undefined };
}

export function useDisputeCount() {
  return useReadContract({
    ...contractConfig,
    functionName: "disputeCount",
  });
}

export function useAllDisputes() {
  const { data: disputeCount } = useDisputeCount();
  const count = Number(disputeCount ?? 0n);

  const contracts = Array.from({ length: count }, (_, i) => ({
    ...contractConfig,
    functionName: "getDispute" as const,
    args: [BigInt(i + 1)] as const,
  }));

  const result = useReadContracts({
    contracts,
    query: { enabled: count > 0 },
  });

  const disputes: (Dispute & { id: bigint })[] = (result.data ?? [])
    .map((r, i) => (r.status === "success" ? { ...(r.result as Dispute), id: BigInt(i + 1) } : null))
    .filter((d): d is Dispute & { id: bigint } => d !== null);

  return { ...result, disputes };
}

export function useJurorPoolSize() {
  return useReadContract({
    ...contractConfig,
    functionName: "getJurorPoolSize",
  });
}

export function useIsJuror(address: `0x${string}` | undefined) {
  return useReadContract({
    ...contractConfig,
    functionName: "registeredJurors",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });
}

export function useUsdcBalance(address: `0x${string}` | undefined) {
  return useReadContract({
    address: USDC_ADDRESS,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });
}

export function useUsdcAllowance(owner: `0x${string}` | undefined) {
  return useReadContract({
    address: USDC_ADDRESS,
    abi: erc20Abi,
    functionName: "allowance",
    args: owner ? [owner, SWARM_COORDINATOR_ADDRESS] : undefined,
    query: { enabled: !!owner },
  });
}
