import { config } from "@/provider/WagmiProvider";
import { waitForTransactionReceipt } from "@wagmi/core";

import toast from "react-hot-toast";

/**
 * Handles transaction status, shows appropriate toasts, and invokes the provided callback.
 *
 * This function waits for the transaction receipt using the provided transaction hash,
 * and handles the status of the transaction by showing success or error toasts.
 * Optionally, a callback can be triggered upon successful transaction completion.
 *
 * @param {string} hash - The transaction hash to wait for the receipt.
 * @param {() => void} [callback] - A callback function to be executed if the transaction is successful.
 * @param {(bool: boolean) => void} [setLoading] - A function to set the loading state (optional).
 *
 * @returns {Promise<"success" | "reverted" | "pending">} - Returns the transaction status.
 *
 * @throws {Error} - Throws an error if the transaction fails or encounters an issue.
 */
export const handleTransactionToasts = async (
  hash: string,
  callback?: () => void,
  setLoading?: (bool: boolean) => void
): Promise<"success" | "reverted" | "pending"> => {
  try {
    // Show loading state if provided
    setLoading && setLoading(true);

    // Wait for the transaction receipt
    const { status } = await waitForTransactionReceipt(config, {
      hash: hash as `0x${string}`,
      confirmations: 1,
    });

    // Handle failed transaction
    if (status === "reverted") {
      setLoading && setLoading(false);
      toast.error("Transaction failed. Please try again.");
      throw new Error(`Transaction ${hash} failed`);
    }

    // Handle successful transaction
    setLoading && setLoading(false);
    // toast.success("Transaction successful!");

    // Execute the callback if provided
    callback && callback();

    return status;
  } catch (error: any) {
    // Handle errors and show failure toast
    setLoading && setLoading(false);
    toast.error(`Transaction failed: ${error.message}`);
    throw error; // Rethrow the error for further handling if needed
  }
};
