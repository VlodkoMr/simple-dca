import React, {useEffect, useState} from "react";
import {useScaffoldContractRead, useScaffoldContractWrite} from "~~/hooks/scaffold-eth";

type MetaHeaderProps = {
  strategy: Strategy;
};

export const JoinStrategy = ({
  strategy,
}: MetaHeaderProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [totalDeposit, setTotalDeposit] = useState(0);
  const [splitCount, setSplitCount] = useState(10);
  const [repeat, setRepeat] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const splitOptions = [3, 5, 7, 10, 15, 20, 25, 30, 50, 100];
  const amountOnce = () => {
    if (totalDeposit && splitCount) {
      return (totalDeposit / splitCount).toFixed(2);
    }
    return 0;
  };

  useEffect(() => {
    if (strategy) {
      setCurrentStep(1);
      setTotalDeposit(0);
      setSplitCount(10);
      setRepeat(0);
      setIsLoading(false);
    }
  }, [strategy]);

  const {writeAsync: joinStrategyWrite} = useScaffoldContractWrite({
    contractName: "FlexDCA",
    functionName: "joinEditStrategy",
    args: [strategy?.id, repeat, amountOnce],
    enabled: strategy && amountOnce,
    onError: (error) => {
      alert(error);
      setIsLoading(false);
    },
    onSuccess: (tx) => {
      if (tx) {
        alert("Transaction sent: " + tx.hash);
      }

      setIsLoading(false);
    }
  });


  const joinStrategy = () => {
    if (!splitCount || !repeat || !totalDeposit) {
      alert("Please enter an amount and repeat period");
      return;
    }

    setIsLoading(true);
    joinStrategyWrite();
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
                  onChange={(e) => {
                    setSplitCount(parseInt(e.target.value));
                  }}
                  className="select select-bordered w-full font-normal max-w-xs focus:outline-none">
                  <option disabled selected>Choose transactions count</option>
                  {splitOptions.map((option) => (
                    <option value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div className={"flex flex-row gap-4 mb-3"}>
                <div className={"w-32 text-right"}>Pay once:</div>
                <div>
                  <span>
                    {totalDeposit > 0 && splitCount > 0 ? (
                      <>
                        {amountOnce()} {strategy.assetFromTitle}
                      </>
                    ) : ("-")}
                  </span>
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
              <ul className="steps gap-4">
                <li className={`step ${currentStep === 1 && "step-primary"}`}>Join Strategy</li>
                <li className={`step ${currentStep === 2 && "step-primary"}`}>Approve {strategy.assetFromTitle}</li>
                <li className={`step ${currentStep === 3 && "step-primary"}`}>Deposit {strategy.assetFromTitle}</li>
              </ul>
            </div>

          )}

        </div>
      )}
    </dialog>
  );
};
