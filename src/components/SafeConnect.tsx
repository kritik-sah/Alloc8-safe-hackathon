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

const SafeConnect = () => {
  const { safeAddresses, selectedSafe, setSelectedSafe } = useSafe();
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
    <div className="max-w-7xl mx-auto">
      <h2>User Safes</h2>
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
  );
};

export default SafeConnect;
