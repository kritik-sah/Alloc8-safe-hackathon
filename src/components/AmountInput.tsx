"use client";

import { isValidNumber } from "@/utils/isValidNumber";
import Image from "next/image";
import React, { useContext, useEffect, useState } from "react";
import { useAccount, useBalance } from "wagmi";

interface AmountInputProps {
  title?: string;
  titleAmount?: string;
  inputAmount: string;
  usdValue?: number;
  tokenList?: `0x${string}`[];
  setInputAmount: React.Dispatch<React.SetStateAction<string>>;
  handleMax?: () => void;
  callBack?: (...args: any) => any;
}

const AmountInput: React.FC<AmountInputProps> = ({
  title,
  titleAmount,
  inputAmount,
  setInputAmount,
  handleMax,
  callBack,
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Allow only valid numbers or an empty string (to clear the field)
    if (isValidNumber(value) || value === "") {
      // Split the input into integer and decimal parts
      const [integerPart, decimalPart] = value.split(".");

      // Check if the integer part exceeds 1000 trillion
      const maxInteger = BigInt(1_000_000_000_000_000); // 1000 trillion as BigInt
      if (integerPart && BigInt(integerPart) > maxInteger) {
        return; // Do not update state if integer part exceeds the limit
      }

      // Check if the decimal part exceeds 9 digits
      if (decimalPart && decimalPart.length > 18) {
        return; // Do not update state if decimals exceed 9
      }

      // Update state if all validations pass
      setInputAmount(value);
      callBack && callBack();
    }
  };

  return (
    <div className="bg-ui-secondary/5 border border-ui-secondary/10 rounded-md">
      <div className="flex items-center justify-between p-4">
        <p className="text-ui-secondary/60 font-light">{title ? title : ""}</p>
        <div className="flex items-center gap-3">
          <p className="text-white">{titleAmount}</p>
          {handleMax ? (
            <p
              onClick={handleMax}
              className="bg-ui-green/15 border-[0.5px] border-ui-green/30 hover:bg-ui-green cursor-pointer rounded-sm py-1 px-3 text-sm text-ui-green hover:text-ui-dark"
            >
              MAX
            </p>
          ) : null}
        </div>
      </div>

      <div className="border border-ui-secondary/5"></div>

      <div className="relative flex justify-between p-4">
        <div>
          <input
            value={inputAmount}
            type="text"
            placeholder="0"
            onChange={handleInputChange}
            className="text-white bg-transparent text-2xl w-full focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 font-bold"
          />
        </div>
      </div>
    </div>
  );
};

export default AmountInput;
