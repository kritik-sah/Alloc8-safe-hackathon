"use client";
import CamelotLiquidityManagerAbi from "@/lib/abi/CamelotLiquidityManager.abi.json";
import MockCamelotV3PoolAbi from "@/lib/abi/MockCamelotV3Pool.abi.json";
import UsdcAbi from "@/lib/abi/usdc.abi.json";
import WethAbi from "@/lib/abi/weth.abi.json";
import { useProtocolKit } from "@/provider/ProtocolKitContext";
import { formatNumber } from "@/utils/formatNumber";
import { formatToken } from "@/utils/formatToken";
import { handleCopy } from "@/utils/handleCopy";
import { parseToken } from "@/utils/parseToken";
import { truncateAddress } from "@/utils/truncateAddress";
import { MetaTransactionData } from "@safe-global/safe-core-sdk-types";
import { ethers } from "ethers";
import { useSearchParams } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { HiOutlineDocumentDuplicate } from "react-icons/hi";
import { erc20Abi } from "viem";
import { useReadContract } from "wagmi";
import AmountInput from "./AmountInput";
import { Button } from "./ui/button";

const AddLiquidity = () => {
  const [liquidity, setLiquidity] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { connectedSafe, protocolKit } = useProtocolKit();
  const searchParams = useSearchParams();
  const PERCENTAGE_FACTOR = 10000;

  const poolId = searchParams.get("id");
  const upperRange = searchParams.get("upperRange");
  const lowerRange = searchParams.get("lowerRange");

  const wethAddress = "0x6b2BFB4585d3aedC7339442f728B67c6247BC8C8";
  const usdcAddress = "0x3495900918D2D50c4ba2e45AF4B8440dEf926858";
  const CamelotLiquidityManager = "0xE8af214043f6f7c69FC66e76515258109fA93F95";
  const MockCamelotV3Pool = "0xF604EDdd6FD3Bc615b075f44F32280dECefB19E6";

  const handleAsyncOperation = async (operation: () => Promise<void>) => {
    setIsLoading(true);
    try {
      await operation();
      refetchAndInvalidateQueries();
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

  const { data: liquidityPositions, refetch: refetchLiquidityPositions } =
    useReadContract({
      abi: MockCamelotV3PoolAbi,
      address: MockCamelotV3Pool as `0x${string}`,
      functionName: "liquidityPositions",
      args: [connectedSafe],
    });

  const addLiquidity = async () => {
    handleAsyncOperation(async () => {
      const Ierc20 = new ethers.Interface(erc20Abi);
      const IWeth = new ethers.Interface(WethAbi);
      const IUsdc = new ethers.Interface(UsdcAbi);
      const ICamelotLiquidityManager = new ethers.Interface(
        CamelotLiquidityManagerAbi
      );

      const transactions: MetaTransactionData[] = [];
      // 1. Faucet
      const wethFaucet = {
        to: wethAddress as `0x${string}`,
        data: IWeth.encodeFunctionData("mintToAddress", [
          connectedSafe,
          parseToken(liquidity.toString()),
        ]),
        value: "0",
      };
      const usdcFaucet = {
        to: usdcAddress as `0x${string}`,
        data: IUsdc.encodeFunctionData("mintToAddress", [
          connectedSafe,
          parseToken(liquidity.toString()),
        ]),
        value: "0",
      };
      // 2. Approve
      const wethApprove = {
        to: wethAddress as `0x${string}`,
        data: Ierc20.encodeFunctionData("approve", [
          CamelotLiquidityManager,
          parseToken(liquidity.toString()),
        ]),
        value: "0",
      };
      const usdcApprove = {
        to: usdcAddress as `0x${string}`,
        data: Ierc20.encodeFunctionData("approve", [
          CamelotLiquidityManager,
          parseToken(liquidity.toString()),
        ]),
        value: "0",
      };
      // 3. Add liquidity
      const addLiquidity = {
        to: CamelotLiquidityManager as `0x${string}`,
        data: ICamelotLiquidityManager.encodeFunctionData("addLiquidity", [
          Number(lowerRange).toFixed(0),
          Number(upperRange).toFixed(0),
          parseToken(liquidity.toString()),
        ]),
        value: "0",
      };

      transactions.push(
        wethFaucet,
        usdcFaucet,
        wethApprove,
        usdcApprove,
        addLiquidity
      );

      const threshold = await protocolKit?.getThreshold();
      const safeApproveTx = await protocolKit?.createTransaction({
        transactions,
      });
      if (!safeApproveTx) {
        throw new Error("Failed to create safe transaction");
      }
      if (threshold === 1) {
        const safeApproveTxResponse = await protocolKit?.executeTransaction(
          safeApproveTx
        );
        // setTransactionLoading(true);
        if (safeApproveTxResponse) {
          //@ts-ignore
          await safeApproveTxResponse?.transactionResponse?.wait();
        }
        toast.success("Add Liquidity successfully", { duration: 5000 });
        // dialogClose();
      } else {
        toast("Transaction created, waiting to be executed");
      }
    });
  };

  const refetchAndInvalidateQueries = () => {
    refetchLiquidityPositions();
  };
  return (
    <div className="flex items-center justify-center">
      <div className="max-w-3xl w-full rounded-xl border border-ui-secondary/10 p-4">
        {connectedSafe ? (
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="text-ui-secondary/40">
              <p className="text-sm">Connected Safe</p>
              <div className="text-ui-green text-lg">
                {truncateAddress(connectedSafe)}{" "}
                <HiOutlineDocumentDuplicate
                  className="inline"
                  onClick={handleCopy.bind(null, connectedSafe)}
                />
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-ui-secondary/40">
                Liquidity Positions
              </p>
              <p className="text-lg text-ui-secondary/60">
                {formatNumber(
                  Number(formatToken(liquidityPositions as bigint))
                )}{" "}
                LP TOKEN
              </p>
            </div>
          </div>
        ) : null}

        <AmountInput
          inputAmount={liquidity}
          setInputAmount={setLiquidity}
          title="Add Liquidity (TOKEN 1)"
        />
        <Button
          onClick={addLiquidity}
          disabled={
            !connectedSafe ||
            Number(liquidity) <= 0 ||
            !upperRange ||
            !lowerRange
          }
          size={"lg"}
          className="w-full mt-4"
        >
          {connectedSafe ? "Add Liquidity" : "Create/Connect Safe Account"}
        </Button>
      </div>
    </div>
  );
};

export default AddLiquidity;
