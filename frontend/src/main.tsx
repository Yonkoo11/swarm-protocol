import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import sdk from "@farcaster/miniapp-sdk";
import { config } from "./config/wagmi";
import App from "./App";
import "./index.css";

const queryClient = new QueryClient();

function Root() {
  useEffect(() => {
    sdk.actions.ready();
  }, []);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme({
          accentColor: "#E8A317",
          accentColorForeground: "#1a1714",
          borderRadius: "medium",
        })}>
          <App />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
);
