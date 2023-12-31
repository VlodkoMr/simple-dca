import React, { useEffect, useMemo, useState } from "react";
import { BigNumber } from "@ethersproject/bignumber";
import { getNetwork } from "@wagmi/core";
import { formatUnits, parseUnits } from "viem";
import { erc20ABI, useAccount, useBalance, useContractRead, useToken, useWaitForTransaction } from "wagmi";
import { repeatOptions } from "~~/config/constants";
import { useDeployedContractInfo, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import { useScaffoldAddressWrite } from "~~/hooks/scaffold-eth/useScaffoldAddressWrite";

type MetaHeaderProps = {
  strategy: Strategy;
  onUpdate: () => void;
};

const defaultRepeat = 168;
const defaultSplitCount = 10;
const splitOptions = [3, 5, 7, 10, 15, 20, 25, 30, 50, 100];

export const JoinStrategy = ({ strategy, onUpdate }: MetaHeaderProps) => {
  const account = useAccount();
  const { chain } = getNetwork();
  const [currentStep, setCurrentStep] = useState(1);
  const [totalDeposit, setTotalDeposit] = useState<string | number>("");
  const [totalDepositWei, setTotalDepositWei] = useState(BigInt(0));
  const [splitCount, setSplitCount] = useState(defaultSplitCount);
  const [repeat, setRepeat] = useState(defaultRepeat);
  const [isLoading, setIsLoading] = useState(false);

  const { data: fromToken } = useToken({
    address: strategy?.fromAsset,
    enabled: !!strategy?.fromAsset,
  });

  const { data: flexDCAContract } = useDeployedContractInfo("FlexDCA");

  const { data: tokenAllowance } = useContractRead({
    address: strategy?.fromAsset,
    abi: erc20ABI,
    chainId: chain?.id,
    functionName: "allowance",
    args: [account?.address as string, flexDCAContract?.address as string],
    enabled: !!strategy?.fromAsset && !!flexDCAContract?.address,
  });

  const { data: fromTokenBalance } = useBalance({
    address: account?.address,
    token: strategy?.fromAsset,
    chainId: chain?.id,
    enabled: !!strategy?.fromAsset && !!account?.address,
  });

  const amountOnce = useMemo(() => {
    if (totalDepositWei && splitCount) {
      return BigNumber.from(totalDepositWei).div(splitCount).toString();
    }
    return 0;
  }, [totalDepositWei, splitCount]);

  useEffect(() => {
    const decimals = fromToken?.decimals || 0;
    const deposit = totalDeposit ? parseUnits(totalDeposit.toString(), decimals) : 0;
    setTotalDepositWei(BigInt(deposit));
  }, [totalDeposit]);

  useEffect(() => {
    if (strategy) {
      setCurrentStep(1);
      setTotalDeposit("");
      setTotalDepositWei(BigInt(0));
      setSplitCount(defaultSplitCount);
      setRepeat(defaultRepeat);
      setIsLoading(false);
    }
  }, [strategy]);

  const { write: joinStrategyWrite, data: joinData } = useScaffoldContractWrite({
    contractName: "FlexDCA",
    functionName: "joinEditStrategy",
    args: [
      strategy?.id,
      BigNumber.from(repeat)
        .mul(60 * 60)
        .toBigInt(),
      BigNumber.from(amountOnce).toBigInt(),
    ],
    // @ts-ignore
    enabled: !!strategy && !!amountOnce && repeat > 0 && !!chain?.id,
    onError: error => {
      alert(error);
      setIsLoading(false);
      onUpdate();
    },
    onSuccess: tx => {
      if (tx) {
        console.log("Transaction sent: " + tx.hash);
      }
    },
  });

  useWaitForTransaction({
    hash: joinData?.hash,
    onSuccess: () => {
      if (!tokenAllowance || BigNumber.from(totalDepositWei).gt(BigNumber.from(tokenAllowance))) {
        setCurrentStep(2);
        writeApprove();
      } else {
        setCurrentStep(3);
        depositWrite();
      }
    },
  });

  const { write: writeApprove, data: approveData } = useScaffoldAddressWrite({
    // @ts-ignore
    address: strategy?.fromAsset,
    functionName: "approve",
    abi: erc20ABI,
    chainId: chain?.id,
    args: [flexDCAContract?.address, BigInt(totalDepositWei)],
    enabled: !!strategy?.fromAsset && !!flexDCAContract?.address && !!totalDepositWei,
    onError: error => {
      alert(error);
      setIsLoading(false);
    },
  });

  useWaitForTransaction({
    hash: approveData?.hash,
    onSuccess: () => {
      setCurrentStep(3);
      depositWrite();
    },
  });

  // @ts-ignore
  const { write: depositWrite, data: depositData } = useScaffoldContractWrite({
    contractName: "FlexDCA",
    functionName: "deposit",
    args: [totalDepositWei, strategy?.id],
    // @ts-ignore
    enabled: !!strategy && !!totalDepositWei,
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
    hash: depositData?.hash,
    onSuccess: () => {
      setIsLoading(false);
      onUpdate();
      // @ts-ignore
      document.getElementById("join_strategy_modal")?.close();
    },
  });

  const setMaxAmount = () => {
    if (fromTokenBalance) {
      setTotalDeposit(parseFloat(fromTokenBalance.formatted));
    }
  };

  const joinStrategy = async () => {
    if (!splitCount || !repeat || !totalDeposit) {
      alert("Please enter an amount and repeat period");
      return;
    }

    if (fromTokenBalance && totalDepositWei > fromTokenBalance.value) {
      alert("Insufficient balance");
      return;
    }

    setIsLoading(true);
    joinStrategyWrite();
  };

  // @ts-ignore
  // @ts-ignore
  return (
    <dialog id="join_strategy_modal" className="modal">
      {strategy && (
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 outline-none pl-4 pr-6">✕</button>
          </form>
          <h3 className="font-bold text-lg">Join {strategy.title} Strategy</h3>

          {!isLoading ? (
            <div className="pt-6 pb-2">
              <div className={"flex flex-row gap-4 mb-3 relative"}>
                <div className={"w-32 pt-3 text-right"}>Total deposit:</div>
                <input
                  type="number"
                  min={1}
                  step={1}
                  value={totalDeposit}
                  onChange={e => {
                    setTotalDeposit(parseFloat(e.target.value));
                  }}
                  className="input input-bordered w-full font-normal max-w-xs focus:outline-none pr-16"
                  placeholder={`Total ${strategy.assetFromTitle}`}
                />
                <div
                  onClick={() => setMaxAmount()}
                  className={"absolute z-10 right-4 top-3.5 text-sm text-blue-400 cursor-pointer hover:text-blue-500"}
                >
                  MAX
                </div>
              </div>

              <div className={"flex flex-row gap-4 mb-3"}>
                <div className={"w-32 pt-3 text-right"}>Repeat:</div>
                <select
                  onChange={e => {
                    setRepeat(parseInt(e.target.value));
                  }}
                  value={repeat.toString()}
                  className="select select-bordered w-full font-normal max-w-xs focus:outline-none"
                >
                  <option disabled selected>
                    Choose schedule period
                  </option>
                  {Object.keys(repeatOptions).map(option => (
                    <option key={option} value={option}>
                      {repeatOptions[option]}
                    </option>
                  ))}
                </select>
              </div>

              <div className={"flex flex-row gap-4 mb-3"}>
                <div className={"w-32 pt-3 text-right"}>Split to:</div>
                <select
                  value={splitCount.toString()}
                  onChange={e => {
                    setSplitCount(parseInt(e.target.value));
                  }}
                  className="select select-bordered w-full font-normal max-w-xs focus:outline-none"
                >
                  <option disabled selected>
                    Choose transactions count
                  </option>
                  {splitOptions.map(option => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div className={"flex flex-row gap-4 mb-3"}>
                <div className={"w-32 text-right"}>Amount once:</div>
                <div>
                  {parseFloat(totalDeposit.toString()) > 0 && splitCount > 0 ? (
                    <>
                      {formatUnits(BigInt(amountOnce), fromToken?.decimals || 0)} {strategy.assetFromTitle}
                    </>
                  ) : (
                    "-"
                  )}
                </div>
              </div>

              <div className={"flex flex-row gap-4"}>
                <div className={"w-32 pt-3 text-right"}></div>
                <button
                  onClick={() => joinStrategy()}
                  disabled={!splitCount || !repeat || !totalDeposit}
                  className={
                    "btn btn-sm bg-orange-200 border-orange-300 rounded-full hover:bg-orange-300 hover:border-orange-400 outline-none"
                  }
                >
                  Join Strategy
                </button>
              </div>
            </div>
          ) : (
            <div className={"text-center"}>
              <div className={"my-6"}>
                <span className="loading loading-spinner loading-lg opacity-50"></span>
              </div>

              <ul className="steps gap-4">
                <li className={`step ${currentStep >= 1 && "step-primary"}`}>Join Strategy</li>
                <li className={`step ${currentStep >= 2 && "step-primary"}`}>Approve</li>
                <li className={`step ${currentStep === 3 && "step-primary"}`}>Deposit {strategy.assetFromTitle}</li>
              </ul>
            </div>
          )}
        </div>
      )}
    </dialog>
  );
};
