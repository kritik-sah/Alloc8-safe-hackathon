import { ConnectButton } from "@rainbow-me/rainbowkit";
import React from "react";

const Header = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-0 py-4">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-2xl text-ui-green"></h3>
        <div className="">
          <ConnectButton />
        </div>
      </div>
    </div>
  );
};

export default Header;
