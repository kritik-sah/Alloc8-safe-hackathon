"use client";
import { useSafe } from "@/provider/CreateAndFetchSafes";
import React from "react";

const SafeConnect = () => {
  const { safeAddresses } = useSafe();

  return (
    <div className="max-w-7xl mx-auto">
      <h2>User Safes</h2>
      {safeAddresses?.length
        ? safeAddresses?.map((safe) => {
            return (
              <div key={safe}>
                <p>{safe}</p>
              </div>
            );
          })
        : null}
    </div>
  );
};

export default SafeConnect;
