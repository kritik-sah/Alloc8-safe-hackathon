import React from "react";
import { CreateOrFetchSafeContextProvider } from "./CreateAndFetchSafes";
import WagmiProviders from "./WagmiProvider";

const Provider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <WagmiProviders>
      <CreateOrFetchSafeContextProvider>
        {children}
      </CreateOrFetchSafeContextProvider>
    </WagmiProviders>
  );
};

export default Provider;
