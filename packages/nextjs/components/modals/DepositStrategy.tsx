import React, { useEffect, useState } from "react";
import { BigNumber } from "@ethersproject/bignumber";
import { parseUnits } from "viem";
import { erc20ABI, useAccount, useContractRead, useNetwork, useToken, useWaitForTransaction } from "wagmi";
import { useDeployedContractInfo, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import { useScaffoldAddressWrite } from "~~/hooks/scaffold-eth/useScaffoldAddressWrite";

type MetaHeaderProps = {
  strategy: Strategy;
  onUpdate: () => void;
};

export const DepositStrategy = ({ strategy, onUpdate }: MetaHeaderProps) => {
  const account = useAccount();
  const { chain } = useNetwork();
  const [currentStep, setCurrentStep] = useState(1);
  const [totalDeposit, setTotalDeposit] = useState(0);
  const [totalDepositWei, setTotalDepositWei] = useState(BigInt(0));
  const [isLoading, setIsLoading] = useState(false);

  const { data: fromToken } = useToken({
    address: strategy?.fromAsset,
    enabled: !!strategy?.fromAsset && !!chain?.id,
    chainId: chain?.id,
    cacheTime: 5_000,
  });

  const { data: flexDCAContract } = useDeployedContractInfo("FlexDCA");

  const { data: tokenAllowance } = useContractRead({
    address: strategy?.fromAsset,
    abi: erc20ABI,
    chainId: chain?.id,
    functionName: "allowance",
    cacheTime: 5_000,
    args: [account?.address as string, flexDCAContract?.address as string],
    enabled: !!strategy?.fromAsset && !!flexDCAContract?.address && !!chain?.id,
  });

  useEffect(() => {
    const decimals = fromToken?.decimals || 0;
    const deposit = totalDeposit ? parseUnits(totalDeposit.toString(), decimals) : 0;
    setTotalDepositWei(BigInt(deposit));
  }, [totalDeposit]);

  useEffect(() => {
    if (strategy) {
      setTotalDeposit(0);
      setTotalDepositWei(BigInt(0));
      setIsLoading(false);
      setCurrentStep(1);
    }
  }, [strategy]);

  const { write: writeApprove, data: approveData } = useScaffoldAddressWrite({
    address: strategy?.fromAsset,
    functionName: "approve",
    abi: erc20ABI,
    args: [flexDCAContract?.address, BigInt(totalDepositWei)],
    enabled: !!strategy?.fromAsset && !!flexDCAContract?.address && !!totalDepositWei && !!chain?.id,
    onError: error => {
      alert(error);
      setIsLoading(false);
    },
    onSuccess: tx => {
      if (tx) {
        console.log("Transaction sent: " + tx.hash);
      }
    },
  });

  useWaitForTransaction({
    hash: approveData?.hash,
    onSuccess: () => {
      depositWrite();
      setCurrentStep(2);
    },
  });

  const { write: depositWrite, data: depositData } = useScaffoldContractWrite({
    contractName: "FlexDCA",
    functionName: "deposit",
    args: [totalDepositWei, strategy?.id],
    enabled: !!strategy && !!totalDepositWei,
    onError: error => {
      alert(error);
      setIsLoading(false);
    },
    // onBlockConfirmation: (txnReceipt) => {
    //   console.log(`depositWrite txnReceipt`, txnReceipt);
    //   setIsLoading(false);
    //   onUpdate();
    //   document.getElementById('deposit_strategy_modal')?.close();
    //   // toast(`Transaction blockHash ${txnReceipt.blockHash.slice(0, 10)}`);
    // },
    onSuccess: tx => {
      if (tx) {
        console.log("Transaction sent: " + tx.hash);
      }
    },
  });

  useWaitForTransaction({
    hash: depositData?.hash,
    onSuccess: () => {
      setIsLoading(false);
      onUpdate();
      document.getElementById("deposit_strategy_modal")?.close();
    },
  });

  const depositToStrategy = async () => {
    if (!totalDeposit) {
      alert("Please enter an amount and repeat period");
      return;
    }

    setIsLoading(true);
    if (!tokenAllowance || BigNumber.from(totalDepositWei).gt(BigNumber.from(tokenAllowance))) {
      writeApprove();
    } else {
      setCurrentStep(2);
      depositWrite();
    }
  };

  return (
    <dialog id="deposit_strategy_modal" className="modal">
      {strategy && (
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 outline-none pl-4 pr-7">✕</button>
          </form>
          <h3 className="font-bold text-lg">Deposit to {strategy.title} Strategy</h3>

          {!isLoading ? (
            <div className="pt-6 pb-2">
              <div className={"flex flex-row gap-4 mb-3"}>
                <div className={"w-32 pt-3 text-right"}>Deposit amount:</div>
                <input
                  type="number"
                  min={1}
                  step={1}
                  onChange={e => {
                    setTotalDeposit(parseFloat(e.target.value));
                  }}
                  className="input input-bordered w-full font-normal max-w-xs focus:outline-none"
                  placeholder={`${strategy.assetFromTitle}`}
                />
              </div>

              <div className={"flex flex-row gap-4"}>
                <div className={"w-32 pt-3 text-right"}></div>
                <button
                  onClick={() => depositToStrategy()}
                  disabled={!totalDeposit}
                  className={
                    "btn btn-sm bg-orange-200 border-orange-300 rounded-full hover:bg-orange-300 hover:border-orange-400 outline-none"
                  }
                >
                  Deposit
                </button>
              </div>
            </div>
          ) : (
            <div className={"text-center"}>
              <div className={"my-6"}>
                <span className="loading loading-spinner loading-lg opacity-50"></span>
              </div>

              <ul className="steps gap-4">
                <li className={`step ${currentStep >= 1 && "step-primary"}`}>Approve</li>
                <li className={`step ${currentStep === 2 && "step-primary"}`}>Deposit {strategy.assetFromTitle}</li>
              </ul>
            </div>
          )}
        </div>
      )}
    </dialog>
  );
};
