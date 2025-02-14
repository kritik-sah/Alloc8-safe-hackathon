"use client";

import useFetchData from "@/hooks/safe/useFetchSafeData";
import React, {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAccount } from "wagmi";

interface SafeContextType {
  safeAddresses: string[];
  selectedSafe: string;
  setSelectedSafe: Dispatch<SetStateAction<string>>;
  isFetchingSafe: boolean;
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
  const [safeAddresses, setSafeAddresses] = useState<string[]>([]);
  const [selectedSafe, setSelectedSafe] = useState<string>("");
  const { loading: isFetchingSafe, fetchData } = useFetchData();

  useEffect(() => {
    const fetchSafeWallet = async () => {
      if (!address) return;
      const data = await fetchData(
        `chains/${chain?.id}/owners/${address}/safes`
      );
      console.log("safeAddresses", data);
      setSafeAddresses(data?.data?.safes || []);
    };

    fetchSafeWallet();
  }, [address, chain?.id]);

  return (
    <CreateOrFetchSafeContext.Provider
      value={{ safeAddresses, selectedSafe, setSelectedSafe, isFetchingSafe }}
    >
      {children}
    </CreateOrFetchSafeContext.Provider>
  );
};

export { CreateOrFetchSafeContextProvider, useSafe };
