import React from "react";
import { Toaster } from "react-hot-toast";
import { CreateOrFetchSafeContextProvider } from "./CreateAndFetchSafes";
import { ProtocolKitProvider } from "./ProtocolKitContext";
import WagmiProviders from "./WagmiProvider";

const Provider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <WagmiProviders>
      <ProtocolKitProvider>
        <CreateOrFetchSafeContextProvider>
          {children}
          <Toaster
            position="bottom-right"
            reverseOrder={false}
            toastOptions={{
              style: {
                zIndex: 9999, // Set custom z-index here
              },
            }}
          />
        </CreateOrFetchSafeContextProvider>
      </ProtocolKitProvider>
    </WagmiProviders>
  );
};

export default Provider;
