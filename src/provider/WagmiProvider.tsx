"use client";
import {
  connectorsForWallets,
  getDefaultConfig,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import {
  coinbaseWallet,
  injectedWallet,
  metaMaskWallet,
  rabbyWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createConfig, http, WagmiProvider } from "wagmi";
import { sepolia } from "wagmi/chains";

/**
 * Project ID used for initializing RainbowKit wallet connections.
 */
const projectId = "df7c359544477408a03f68cc41727c83";

const connectors = connectorsForWallets(
  [
    {
      groupName: "Recommended",
      wallets: [
        rabbyWallet,
        walletConnectWallet,
        injectedWallet,
        coinbaseWallet,
        metaMaskWallet,
      ],
    },
  ],
  {
    appName: "alloc8",
    projectId: projectId,
  }
);
export const config = createConfig({
  chains: [sepolia],
  transports: {
    [sepolia.id]: http(process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL!),
  },
  connectors,
  ssr: true, // Enable Server Side Rendering (SSR) for the dApp
});
const web3config = getDefaultConfig({
  appName: "alloc8",
  projectId: projectId,
  chains: [sepolia],
  ssr: true, // If your dApp uses server side rendering (SSR)
});

const queryClient = new QueryClient();
const WagmiProviders = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <WagmiProvider config={web3config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default WagmiProviders;
