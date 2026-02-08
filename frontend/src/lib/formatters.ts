import { USDC_DECIMALS, ERROR_MESSAGES } from "./constants";

export function formatUsdc(amount: bigint): string {
  const whole = amount / BigInt(10 ** USDC_DECIMALS);
  const frac = amount % BigInt(10 ** USDC_DECIMALS);
  const fracStr = frac.toString().padStart(USDC_DECIMALS, "0").replace(/0+$/, "");
  if (fracStr === "") return whole.toString();
  return `${whole}.${fracStr}`;
}

export function parseUsdc(amount: string): bigint {
  const [whole, frac = ""] = amount.split(".");
  const paddedFrac = frac.slice(0, USDC_DECIMALS).padEnd(USDC_DECIMALS, "0");
  return BigInt(whole || "0") * BigInt(10 ** USDC_DECIMALS) + BigInt(paddedFrac);
}

export function truncateAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatDeadline(timestamp: bigint): string {
  const date = new Date(Number(timestamp) * 1000);
  const now = Date.now();
  const diff = date.getTime() - now;

  if (diff < 0) return "Expired";
  if (diff < 3600_000) return `${Math.floor(diff / 60_000)}m left`;
  if (diff < 86400_000) return `${Math.floor(diff / 3600_000)}h left`;
  return `${Math.floor(diff / 86400_000)}d left`;
}

export function formatDate(timestamp: bigint): string {
  return new Date(Number(timestamp) * 1000).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function getErrorMessage(error: unknown): string {
  if (!error) return "Unknown error";
  const msg = (error as { shortMessage?: string }).shortMessage
    ?? (error as Error).message
    ?? String(error);
  // Extract custom error name from "ContractFunctionExecutionError: ... ErrorName()"
  const match = msg.match(/error (\w+)\(\)/);
  if (match) {
    return ERROR_MESSAGES[match[1]] ?? match[1];
  }
  if (msg.includes("User rejected")) return "Transaction rejected";
  if (msg.includes("insufficient funds")) return "Insufficient funds";
  return msg.length > 120 ? msg.slice(0, 120) + "..." : msg;
}
