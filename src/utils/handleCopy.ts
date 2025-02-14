import toast from "react-hot-toast";

/** Handle copy to clipboard and show success message */
export const handleCopy = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  } catch (error) {
    toast.error("Failed to copy to clipboard");
  }
};
