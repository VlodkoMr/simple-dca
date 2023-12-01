import React, {useEffect, useState} from "react";
import {useDeployedContractInfo, useScaffoldContractWrite} from "~~/hooks/scaffold-eth";
import {BigNumber} from "@ethersproject/bignumber";
import {erc20ABI, useAccount, useContractRead, useToken} from "wagmi";
import {parseUnits} from "viem";
import {useScaffoldAddressWrite} from "~~/hooks/scaffold-eth/useScaffoldAddressWrite";

type MetaHeaderProps = {
  strategy: Strategy;
};

export const DepositStrategy = ({
  strategy,
}: MetaHeaderProps) => {
  const account = useAccount();
  const [currentStep, setCurrentStep] = useState(1);
  const [totalDeposit, setTotalDeposit] = useState(0);
  const [totalDepositWei, setTotalDepositWei] = useState(BigInt(0));
  const [isLoading, setIsLoading] = useState(false);

  const {data: fromToken} = useToken({
    address: strategy?.fromAsset,
    enabled: !!strategy?.fromAsset,
  });

  const {data: flexDCAContract} = useDeployedContractInfo("FlexDCA");

  const {data: tokenAllowance} = useContractRead({
    address: strategy?.fromAsset,
    abi: erc20ABI,
    functionName: "allowance",
    args: [account?.address as string, flexDCAContract?.address as string],
    enabled: !!strategy?.fromAsset && !!flexDCAContract?.address,
  });

  useEffect(() => {
    const decimals = fromToken?.decimals || 0;
    const deposit = totalDeposit ? parseUnits(totalDeposit.toString(), decimals) : 0;
    setTotalDepositWei(deposit);
  }, [totalDeposit]);


  useEffect(() => {
    if (strategy) {
      setTotalDeposit(0);
      setTotalDepositWei(BigInt(0));
      setIsLoading(false);
      setCurrentStep(1);
    }
  }, [strategy]);

  const {writeAsync: writeApprove} = useScaffoldAddressWrite({
    address: strategy?.fromAsset,
    functionName: "approve",
    abi: erc20ABI,
    args: [flexDCAContract?.address, Number(totalDepositWei)],
    enabled: !!strategy?.fromAsset && !!flexDCAContract?.address && !!totalDepositWei,
    onBlockConfirmation: (txnReceipt) => {
      console.log(`writeApprove txnReceipt`, txnReceipt);
      depositWrite();
      setCurrentStep(2);
      // toast(`Transaction blockHash ${txnReceipt.blockHash.slice(0, 10)}`);
    },
    onError: (error) => {
      alert(error);
      setIsLoading(false);
    },
  });

  const {writeAsync: depositWrite} = useScaffoldContractWrite({
    contractName: "FlexDCA",
    functionName: "deposit",
    args: [totalDepositWei, strategy?.id],
    enabled: !!strategy && !!totalDepositWei,
    onError: (error) => {
      alert(error);
      setIsLoading(false);
    },
    onBlockConfirmation: (txnReceipt) => {
      console.log(`depositWrite txnReceipt`, txnReceipt);
      setIsLoading(false);
      document.getElementById('deposit_strategy_modal')?.close();
      // toast(`Transaction blockHash ${txnReceipt.blockHash.slice(0, 10)}`);
    },
    onSuccess: (tx) => {
      if (tx) {
        console.log("Transaction sent: " + tx.hash);
      }
    }
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
  }

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
                  onChange={(e) => {
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
                  className={"btn btn-sm bg-orange-200 border-orange-300 rounded-full hover:bg-orange-300 hover:border-orange-400 outline-none"}>
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
