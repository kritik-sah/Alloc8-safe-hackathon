import React, { Suspense } from "react";
import AddLiquidity from "./AddLiquidity";
import SafeConnect from "./SafeConnect";

const Homepage = () => {
  return (
    <div>
      <SafeConnect />
      <Suspense fallback={<div>Loading...</div>}>
        <AddLiquidity />
      </Suspense>
    </div>
  );
};

export default Homepage;
