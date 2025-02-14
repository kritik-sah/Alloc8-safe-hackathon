"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSafe } from "@/provider/CreateAndFetchSafes";
import { useProtocolKit } from "@/provider/ProtocolKitContext";
import { truncateAddress } from "@/utils/truncateAddress";
import React, { useEffect } from "react";
import { Button } from "./ui/button";

const SafeConnect = () => {
  const {
    safeAddresses,
    selectedSafe,
    setSelectedSafe,
    createSafeWallet,
    isCreatingSafe,
    isSafeCreated,
  } = useSafe();
  const { handleSafeConnect } = useProtocolKit();

  useEffect(() => {
    if (safeAddresses?.length) {
      setSelectedSafe(safeAddresses[0]);
    }
  }, [safeAddresses]);

  useEffect(() => {
    if (selectedSafe) {
      handleSafeConnect(selectedSafe);
    }
  }, [selectedSafe]);

  return (
    <div className="max-w-7xl mx-auto bg-ui-midnightAccent border border-ui-secondary/10 p-4 rounded-xl my-6 flex items-start justify-between">
      <div className="">
        <h2 className="text-xl mb-3">Select Safe Account</h2>
        <Select
          value={selectedSafe}
          onValueChange={(e) => {
            setSelectedSafe(e);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Safe" />
          </SelectTrigger>
          <SelectContent>
            {safeAddresses?.length
              ? safeAddresses?.map((safe) => {
                  return (
                    <SelectItem key={safe} value={safe}>
                      {truncateAddress(safe)}
                    </SelectItem>
                  );
                })
              : null}
          </SelectContent>
        </Select>
      </div>
      <div className="">
        <h2 className="text-xl mb-3">Create Safe Account</h2>
        <Button
          onClick={createSafeWallet}
          variant={"default"}
          className="w-full"
        >
          Create{" "}
        </Button>
      </div>
    </div>
  );
};

export default SafeConnect;
