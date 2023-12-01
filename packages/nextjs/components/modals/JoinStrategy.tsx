import React, {useEffect, useMemo, useState} from "react";
import {useDeployedContractInfo, useScaffoldContractWrite} from "~~/hooks/scaffold-eth";
import {BigNumber} from "@ethersproject/bignumber";
import {erc20ABI, useAccount, useContractRead, useToken} from "wagmi";
import {formatUnits, parseUnits} from "viem";
import {useScaffoldAddressWrite} from "~~/hooks/scaffold-eth/useScaffoldAddressWrite";

type MetaHeaderProps = {
  strategy: Strategy;
};

const defaultRepeat = 168;
const defaultSplitCount = 10;
const splitOptions = [3, 5, 7, 10, 15, 20, 25, 30, 50, 100];

export const JoinStrategy = ({
  strategy,
}: MetaHeaderProps) => {
  const account = useAccount();
  const [currentStep, setCurrentStep] = useState(1);
  const [totalDeposit, setTotalDeposit] = useState(0);
  const [totalDepositWei, setTotalDepositWei] = useState(BigInt(0));
  const [splitCount, setSplitCount] = useState(defaultSplitCount);
  const [repeat, setRepeat] = useState(defaultRepeat);
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

  const amountOnce = useMemo(() => {
    if (totalDepositWei && splitCount) {
      return BigNumber.from(totalDepositWei).div(splitCount).toString();
    }
    return 0;
  }, [totalDepositWei, splitCount]);

  useEffect(() => {
    const decimals = fromToken?.decimals || 0;
    setTotalDepositWei(parseUnits(totalDeposit.toString(), decimals));
  }, [totalDeposit]);


  useEffect(() => {
    if (strategy) {
      setCurrentStep(1);
      setTotalDeposit(0);
      setTotalDepositWei(BigInt(0));
      setSplitCount(defaultSplitCount);
      setRepeat(defaultRepeat);
      setIsLoading(false);
    }
  }, [strategy]);

  const {writeAsync: joinStrategyWrite} = useScaffoldContractWrite({
    contractName: "FlexDCA",
    functionName: "joinEditStrategy",
    args: [strategy?.id, BigNumber.from(repeat).mul(60 * 60).toBigInt(), BigNumber.from(amountOnce).toBigInt()],
    enabled: !!strategy && !!amountOnce && repeat > 0,
    onError: (error) => {
      alert(error);
      setIsLoading(false);
    },
    onBlockConfirmation: (txnReceipt) => {
      console.log(`joinStrategyWrite txnReceipt`, txnReceipt);
      // toast(`Transaction blockHash ${txnReceipt.blockHash.slice(0, 10)}`);
    },
    onSuccess: (tx) => {
      if (tx) {
        console.log("Transaction sent: " + tx.hash);
      }
    }
  });

  const {writeAsync: writeApprove} = useScaffoldAddressWrite({
    address: strategy?.fromAsset,
    functionName: "approve",
    abi: erc20ABI,
    args: [flexDCAContract?.address, Number(totalDepositWei)],
    enabled: !!strategy?.fromAsset && !!flexDCAContract?.address && !!totalDepositWei,
    onBlockConfirmation: (txnReceipt) => {
      console.log(`writeApprove txnReceipt`, txnReceipt);
      setCurrentStep(3);
      depositWrite();
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
      document.getElementById('join_strategy_modal')?.close();
      // toast(`Transaction blockHash ${txnReceipt.blockHash.slice(0, 10)}`);
    },
    onSuccess: (tx) => {
      if (tx) {
        console.log("Transaction sent: " + tx.hash);
      }
    }
  });

  const joinStrategy = async () => {
    if (!splitCount || !repeat || !totalDeposit) {
      alert("Please enter an amount and repeat period");
      return;
    }

    setIsLoading(true);
    joinStrategyWrite().then(() => {
      if (!tokenAllowance || BigNumber.from(totalDepositWei).gt(BigNumber.from(tokenAllowance))) {
        setCurrentStep(2);
        writeApprove();
      } else {
        setCurrentStep(3);
        depositWrite();
      }
    });
  }

  return (
    <dialog id="join_strategy_modal" className="modal">
      {strategy && (
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 outline-none pl-4 pr-7">✕</button>
          </form>
          <h3 className="font-bold text-lg">Join {strategy.title} Strategy</h3>

          {!isLoading ? (
            <div className="pt-6 pb-2">
              <div className={"flex flex-row gap-4 mb-3"}>
                <div className={"w-32 pt-3 text-right"}>Total deposit:</div>
                <input
                  type="number"
                  min={1}
                  step={1}
                  onChange={(e) => {
                    setTotalDeposit(parseFloat(e.target.value));
                  }}
                  className="input input-bordered w-full font-normal max-w-xs focus:outline-none"
                  placeholder={`Total ${strategy.assetFromTitle}`}
                />
              </div>

              <div className={"flex flex-row gap-4 mb-3"}>
                <div className={"w-32 pt-3 text-right"}>Repeat:</div>
                <select
                  onChange={(e) => {
                    setRepeat(parseInt(e.target.value));
                  }}
                  defaultValue={repeat}
                  className="select select-bordered w-full font-normal max-w-xs focus:outline-none">
                  <option disabled selected>Choose schedule period</option>
                  <option value={12}>Twice a day</option>
                  <option value={24}>Once a day</option>
                  <option value={84}>Twice a week</option>
                  <option value={168}>Once a week</option>
                  <option value={360}>Twice a month</option>
                  <option value={720}>Once a month</option>
                  <option value={1080}>Twice every 3 months</option>
                  <option value={2160}>Once every 3 months</option>
                  <option value={4320}>Once every 6 months</option>
                  <option value={8640}>Once a year</option>
                </select>
              </div>

              <div className={"flex flex-row gap-4 mb-3"}>
                <div className={"w-32 pt-3 text-right"}>Split to:</div>
                <select
                  defaultValue={splitCount}
                  onChange={(e) => {
                    setSplitCount(parseInt(e.target.value));
                  }}
                  className="select select-bordered w-full font-normal max-w-xs focus:outline-none">
                  <option disabled selected>Choose transactions count</option>
                  {splitOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div className={"flex flex-row gap-4 mb-3"}>
                <div className={"w-32 text-right"}>Amount once:</div>
                <div>
                  {totalDeposit > 0 && splitCount > 0 ? (
                    <>
                      {formatUnits(amountOnce, fromToken?.decimals || 0)} {strategy.assetFromTitle}
                    </>
                  ) : ("-")}
                </div>
              </div>

              <div className={"flex flex-row gap-4"}>
                <div className={"w-32 pt-3 text-right"}></div>
                <button
                  onClick={() => joinStrategy()}
                  disabled={!splitCount || !repeat || !totalDeposit}
                  className={"btn btn-sm bg-orange-200 border-orange-300 rounded-full hover:bg-orange-300 hover:border-orange-400 outline-none"}>
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
                <li className={`step ${currentStep >= 2 && "step-primary"}`}>Approve {strategy.assetFromTitle}</li>
                <li className={`step ${currentStep === 3 && "step-primary"}`}>Deposit {strategy.assetFromTitle}</li>
              </ul>
            </div>

          )}

        </div>
      )}
    </dialog>
  );
};