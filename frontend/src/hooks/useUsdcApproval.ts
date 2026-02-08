import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { erc20Abi } from "../lib/abi";
import { USDC_ADDRESS, SWARM_COORDINATOR_ADDRESS } from "../lib/constants";

export function useUsdcApproval() {
  const { writeContract, data: hash, isPending, error, reset } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  function approve(amount: bigint) {
    writeContract({
      address: USDC_ADDRESS,
      abi: erc20Abi,
      functionName: "approve",
      args: [SWARM_COORDINATOR_ADDRESS, amount],
    });
  }

  return { approve, hash, isPending, isConfirming, isSuccess, error, reset };
}
