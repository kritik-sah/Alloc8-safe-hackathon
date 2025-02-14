"use client";

import Safe, { EthersAdapter } from "@safe-global/protocol-kit";
import { ethers } from "ethers";
import React, { createContext, ReactNode, useContext, useState } from "react";
import { useAccount } from "wagmi";

// Define the type for protocolKit context
interface ProtocolKitContextType {
  protocolKit: Safe | null; // ProtocolKit instance (Safe wallet connection)
  connectedSafe: string; // Address of the connected Safe wallet
  isConnectingSafe: boolean; // Flag to track Safe wallet connection state
  handleSafeConnect: (safeAddress: string) => Promise<void>; // Function to handle Safe wallet connection
}

/**
 * Context to manage the connection to the Safe wallet using ProtocolKit.
 * Provides the ProtocolKit instance, connected Safe address, connection state, and a function to connect to the Safe wallet.
 */
const ProtocolKitContext = createContext<ProtocolKitContextType | undefined>(
  undefined
);

/**
 * Custom hook to access the ProtocolKitContext.
 * This hook allows components to use the Safe wallet connection state and functions.
 *
 * @throws Will throw an error if used outside the `ProtocolKitProvider` context.
 * @returns The context value containing protocolKit, connectedSafe, isConnectingSafe, and handleSafeConnect.
 */
export const useProtocolKit = (): ProtocolKitContextType => {
  const context = useContext(ProtocolKitContext);
  if (!context) {
    throw new Error("useProtocolKit must be used within a ProtocolKitProvider");
  }
  return context;
};

/**
 * Provider component to manage the Safe wallet connection using ProtocolKit.
 * It provides the context to the child components and exposes a function to connect to a Safe wallet.
 *
 * @param children The child components that need access to the ProtocolKitContext state and functions.
 * @returns The context provider with the Safe wallet connection state and functions.
 */
export const ProtocolKitProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { address, chain } = useAccount(); // Get the connected wallet address using wagmi
  const [protocolKit, setProtocolKit] = useState<Safe | null>(null); // Safe wallet instance
  const [connectedSafe, setConnectedSafe] = useState<string>(""); // Connected Safe address
  const [isConnectingSafe, setIsConnectingSafe] = useState(false); // Flag indicating connection state

  /**
   * Handles the connection to a Safe wallet using the provided Safe address.
   * It sets up the Safe SDK with the correct Ethereum adapter and connects to the Safe wallet.
   *
   * @param safeAddress The address of the Safe wallet to connect to.
   */
  const handleSafeConnect = async (safeAddress: string) => {
    try {
      setIsConnectingSafe(true); // Set connecting flag to true while establishing connection
      const provider = new ethers.BrowserProvider(window.ethereum!); // Get the provider (BrowserProvider for MetaMask)
      const safeOwner = await provider.getSigner(0); // Get the signer (first wallet in MetaMask)
      const ethAdapter = new EthersAdapter({
        ethers: ethers as any, // Provide ethers.js instance
        signerOrProvider: safeOwner as any, // Provide signer for Safe connection
      });

      // Create a new Safe SDK instance with the Ethereum adapter
      //@ts-ignore
      let newProtocolKit = await Safe.create({ ethAdapter, safeAddress });

      // Connect to the Safe with the provided address
      newProtocolKit = await newProtocolKit.connect({
        //@ts-ignore
        ethAdapter,
        safeAddress,
        isL1SafeSingleton: true,
      });

      setProtocolKit(newProtocolKit); // Set the ProtocolKit instance

      // Get the connected Safe address and update the state
      const connectedSafeAddress = await newProtocolKit.getAddress();
      setConnectedSafe(connectedSafeAddress);
    } catch (error) {
      console.error("Error connecting to Safe:", error); // Handle errors during connection
    } finally {
      setIsConnectingSafe(false); // Set the connecting flag to false once the process is complete
    }
  };

  return (
    <ProtocolKitContext.Provider
      value={{
        protocolKit,
        handleSafeConnect,
        connectedSafe,
        isConnectingSafe,
      }}
    >
      {children}
    </ProtocolKitContext.Provider>
  );
};
