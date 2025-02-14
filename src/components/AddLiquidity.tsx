"use client";
import CamelotLiquidityManagerAbi from "@/lib/abi/CamelotLiquidityManager.abi.json";
import MockCamelotV3PoolAbi from "@/lib/abi/MockCamelotV3Pool.abi.json";
import UsdcAbi from "@/lib/abi/usdc.abi.json";
import WethAbi from "@/lib/abi/weth.abi.json";
import { useProtocolKit } from "@/provider/ProtocolKitContext";
import { MetaTransactionData } from "@safe-global/safe-core-sdk-types";
import { ethers } from "ethers";
import { useSearchParams } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { erc20Abi } from "viem";
import AmountInput from "./AmountInput";
import { Button } from "./ui/button";

const AddLiquidity = () => {
  const [liquidity, setLiquidity] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { connectedSafe } = useProtocolKit();
  const searchParams = useSearchParams();

  const poolId = searchParams.get("id");
  const upperRange = searchParams.get("upperRange");
  const lowerRange = searchParams.get("lowerRange");

  const wethAddress = "0x6b2BFB4585d3aedC7339442f728B67c6247BC8C8";
  const usdcAddress = "0x3495900918D2D50c4ba2e45AF4B8440dEf926858";
  const CamelotLiquidityManager = "0xE8af214043f6f7c69FC66e76515258109fA93F95";
  const MockCamelotV3Pool = "0xF604EDdd6FD3Bc615b075f44F32280dECefB19E6";

  const getMinMaxTicks = (tick1?: string | null, tick2?: string | null) => {
    const num1 = tick1 ? parseFloat(tick1) : NaN;
    const num2 = tick2 ? parseFloat(tick2) : NaN;

    if (isNaN(num1) && isNaN(num2)) return { min: null, max: null };
    if (isNaN(num1)) return { min: num2, max: num2 };
    if (isNaN(num2)) return { min: num1, max: num1 };

    return { min: Math.min(num1, num2), max: Math.max(num1, num2) };
  };

  const handleAsyncOperation = async (operation: () => Promise<void>) => {
    setIsLoading(true);
    try {
      await operation();
      // refetchAndInvalidateQueries();
    } catch (error: any) {
      console.error(error);
      const errorMessage =
        error?.message || "An unexpected error occurred. Please try again.";

      // Show the error toast
      toast.error(errorMessage, { duration: 5000 });
      // toast.error("Transaction Failed", { duration: 5000 });
    } finally {
      setIsLoading(false);
    }
  };

  // give allowance approval by safe wallet
  // const handleCallSafeApprove = async () => {
  //   handleAsyncOperation(async () => {
  //     const iface_erc20 = new ethers.Interface(erc20Abi);
  //     const transactions: MetaTransactionData[] = [
  //       {
  //         to: selectedTokenInput?.address as `0x${string}`,
  //         data: iface_erc20.encodeFunctionData("approve", [
  //           pools[0].borrowManager,
  //           parseEther(inputAmount.toString()),
  //         ]),
  //         value: "0",
  //       },
  //     ];

  //     const threshold = await protocolKit?.getThreshold();
  //     const safeApproveTx = await protocolKit?.createTransaction({
  //       transactions,
  //     });
  //     if (!safeApproveTx) {
  //       throw new Error("Failed to create borrow credit transaction");
  //     }
  //     if (threshold === 1) {
  //       const safeApproveTxResponse = await protocolKit?.executeTransaction(
  //         safeApproveTx
  //       );
  //       // setTransactionLoading(true);
  //       if (safeApproveTxResponse) {
  //         //@ts-ignore
  //         await safeApproveTxResponse?.transactionResponse?.wait();
  //       }
  //       toast.success("Approved successfully", { duration: 5000 });
  //       // dialogClose();
  //     } else {
  //       toast("Transaction created, waiting to be executed");
  //     }
  //   });
  // };

  // const handleSafeBorrowCredit = async () =>
  //   handleAsyncOperation(async () => {
  //     if (
  //       !address ||
  //       !connectedSafe ||
  //       !creditAccountOwner ||
  //       selectedSafe?.safeAddress !== connectedSafe
  //     ) {
  //       throw new Error("Safe disconnected or wrong safe connected");
  //     }
  //     const iface_borrowCredit = new ethers.Interface(borrowManagerAbi);
  //     const leverageAmount = Number(inputAmount || 0) * leverage;
  //     const transactions: MetaTransactionData[] = [
  //       {
  //         to: pools[0].borrowManager,
  //         data: iface_borrowCredit.encodeFunctionData("borrowCredit", [
  //           parseEther(leverageAmount.toString()),
  //         ]),
  //         value: "0",
  //       },
  //     ];
  //     const threshold = await protocolKit?.getThreshold();
  //     const borrowCreditTx = await protocolKit?.createTransaction({
  //       transactions,
  //     });
  //     if (threshold === 1 && borrowCreditTx) {
  //       const borrowCreditTxResponse = await protocolKit?.executeTransaction(
  //         borrowCreditTx
  //       );
  //       await borrowCreditTxResponse?.transactionResponse?.wait();

  //       sendGAEvent("event", "leverage_borrow_credit", {
  //         address: JSON.stringify(address),
  //         borrowManager: JSON.stringify(pools[0].borrowManager),
  //         leverageAccount: JSON.stringify(connectedSafe),
  //         value: inputAmount,
  //         token: JSON.stringify(pools[0].underlyingToken),
  //       });
  //       toast.success("Borrowed successfully", { duration: 5000 });
  //       setInputAmount("");
  //     } else {
  //       toast("Transaction created, waiting to be executed");
  //     }
  //   });

  // const handleCallRepayDebt = async () =>
  //   handleAsyncOperation(async () => {
  //     const iface_borrowManager = new ethers.Interface(borrowManagerAbi);
  //     const iface_erc20 = new ethers.Interface(erc20Abi);
  //     const transactions: MetaTransactionData[] = [
  //       {
  //         to: pools[0].borrowManager as `0x${string}`,
  //         data: iface_borrowManager.encodeFunctionData("repayDebt", [
  //           parseEther(inputAmount.toString()),
  //         ]),
  //         value: "0",
  //       },
  //     ];
  //     if (
  //       Number(formatToken(safeCollateralAllowance || BigInt(0))) <=
  //       Number(inputAmount)
  //     ) {
  //       transactions.unshift({
  //         to: selectedTokenInput?.address as `0x${string}`,
  //         data: iface_erc20.encodeFunctionData("approve", [
  //           pools[0].borrowManager,
  //           parseEther(inputAmount.toString()),
  //         ]),
  //         value: "0",
  //       });
  //     }

  //     const threshold = await protocolKit?.getThreshold();
  //     const repayDebtTx = await protocolKit?.createTransaction({
  //       transactions,
  //     });
  //     if (threshold === 1 && repayDebtTx) {
  //       const repayDebtTxResponse = await protocolKit?.executeTransaction(
  //         repayDebtTx
  //       );
  //       await repayDebtTxResponse?.transactionResponse?.wait();
  //       sendGAEvent("event", "leverage_repay_debt", {
  //         address: JSON.stringify(address),
  //         borrowManager: JSON.stringify(pools[0].borrowManager),
  //         leverageAccount: JSON.stringify(connectedSafe),
  //         value: inputAmount,
  //         token: JSON.stringify(pools[0].underlyingToken),
  //       });
  //       toast.success("Repaid successfully", { duration: 5000 });
  //       setInputAmount("");
  //     } else {
  //       toast("Transaction created, waiting to be executed");
  //     }
  //   });

  const addLiquidity = async () => {
    const Ierc20 = new ethers.Interface(erc20Abi);
    const IWeth = new ethers.Interface(WethAbi);
    const IUsdc = new ethers.Interface(UsdcAbi);

    // 1. Faucet

    // 2. Approve

    // 3. Add liquidity
  };

  return (
    <div className="flex items-center justify-center">
      <div className="max-w-3xl w-full rounded-xl border border-ui-secondary/10 p-4">
        <AmountInput
          inputAmount={liquidity}
          setInputAmount={setLiquidity}
          title="Add Liquidity"
        />
        <Button disabled={!connectedSafe} size={"lg"} className="w-full mt-4">
          {connectedSafe ? "Add Liquidity" : "Create/Connect Safe Account"}
        </Button>
      </div>
    </div>
  );
};

export default AddLiquidity;
