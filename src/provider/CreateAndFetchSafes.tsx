"use client";

import useFetchData from "@/hooks/safe/useFetchSafeData";
import { handleTransactionToasts } from "@/utils/handleTransactionToasts";
import Safe, {
  EthersAdapter,
  SafeAccountConfig,
  SafeFactory,
} from "@safe-global/protocol-kit";
import { getTransactionCount } from "@wagmi/core";
import { ethers } from "ethers";
import React, {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import toast from "react-hot-toast";
import { useAccount } from "wagmi";
import { config } from "./WagmiProvider";

interface SafeContextType {
  safeAddresses: string[];
  selectedSafe: string;
  setSelectedSafe: Dispatch<SetStateAction<string>>;
  isFetchingSafe: boolean;
  createSafeWallet: () => Promise<Safe | undefined>;
  isSafeCreated: boolean;
  isCreatingSafe: boolean;
}

const CreateOrFetchSafeContext = createContext<SafeContextType | undefined>(
  undefined
);

const useSafe = () => {
  const context = useContext(CreateOrFetchSafeContext);
  if (!context) {
    throw new Error(
      "useSafe must be used within a CreateOrFetchSafeContextProvider"
    );
  }
  return context;
};

const CreateOrFetchSafeContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { address, chain } = useAccount();
  const [isSafeCreated, setIsSafeCreated] = useState(false);
  const [isCreatingSafe, setIsCreatingSafe] = useState(false);
  const [safeAddresses, setSafeAddresses] = useState<string[]>([]);
  const [selectedSafe, setSelectedSafe] = useState<string>("");
  const { loading: isFetchingSafe, fetchData } = useFetchData();

  const fetchSafeWallet = async () => {
    if (!address) return;
    const data: any = await fetchData(
      `chains/${chain?.id}/owners/${address}/safes`
    );
    console.log("safeAddresses", data);
    setSafeAddresses(data?.data?.safes || []);
  };
  useEffect(() => {
    fetchSafeWallet();
  }, [address, chain?.id]);

  const createSafeWallet = async () => {
    setIsCreatingSafe(true);
    const provider = new ethers.BrowserProvider(window.ethereum);
    const safeOwner = await provider.getSigner(0);

    const ethAdapter1 = new EthersAdapter({
      ethers,
      signerOrProvider: safeOwner,
    });

    const safeFactory = await SafeFactory.create({
      //@ts-ignore
      ethAdapter: ethAdapter1,
      isL1SafeSingleton: false,
    });

    const callback = (txHash: string): void => {
      handleTransactionToasts(
        txHash,
        () => {
          setIsSafeCreated(true);
          refetchRevalidate();
          toast.success("Created new safe account", { duration: 5000 });
        },
        setIsCreatingSafe
      );
    };

    const transactionCount = await getTransactionCount(config, {
      address: address!,
    });

    const saltNonce = transactionCount.toString();

    const safeAccountConfig: SafeAccountConfig = {
      owners: [address as `0x${string}`],
      threshold: 1,
    };

    try {
      const safeSdk = await safeFactory.deploySafe({
        safeAccountConfig,
        saltNonce,
        callback,
      });
      return safeSdk;
    } catch (error: any) {
      console.error(error.message);
    }
  };

  const refetchRevalidate = () => {
    fetchSafeWallet();
  };

  return (
    <CreateOrFetchSafeContext.Provider
      value={{
        safeAddresses,
        selectedSafe,
        setSelectedSafe,
        isFetchingSafe,
        createSafeWallet,
        isSafeCreated,
        isCreatingSafe,
      }}
    >
      {children}
    </CreateOrFetchSafeContext.Provider>
  );
};

export { CreateOrFetchSafeContextProvider, useSafe };
