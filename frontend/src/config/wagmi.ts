import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { baseSepolia } from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "HiveMind",
  projectId: "hivemind-local-dev",
  chains: [baseSepolia],
  ssr: false,
});
