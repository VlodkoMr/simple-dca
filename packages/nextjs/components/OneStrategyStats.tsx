import React from "react";
import { formatUnits } from "viem";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";


interface OneStrategyProps {
  strategy: Strategy;
  myStrategiesObj: Record<number, UserStrategy>;
  tokenDecimals: Record<string, number>|undefined;
}

export const OneStrategyStats = (
  { strategy, tokenDecimals, myStrategiesObj }: OneStrategyProps
) => {

  console.log(`strategy`, strategy);

  return (
    <div key={strategy.id}
         className={"block flex-1 min-w-64 rounded-lg bg-white px-8 py-4 shadow-sm mb-2 border border-white transition"}>
      <div className={"flex flex-row flex-nowrap justify-between border-b mb-3"}>
        <div className={"font-semibold text-xl text-gray-700 uppercase mt-1"}>{strategy.title}</div>
        <div className={"text-sm leading-10 text-right opacity-70"}>
          {strategy.isActive ? ("available") : ("filled")}
        </div>
      </div>

      <div>
        Assets in queue: <b>{
        parseFloat(formatUnits(strategy.totalBalance, tokenDecimals[strategy.fromAsset])).toFixed(2)
      } {strategy.assetFromTitle}</b>
      </div>
      <div>
        Total spent: <b>{
        parseFloat(formatUnits(strategy.totalAmountFromAsset, tokenDecimals[strategy.fromAsset])).toFixed(2)
      } {strategy.assetFromTitle}</b>
      </div>
      <div>
        Total received: <b>{
        parseFloat(formatUnits(strategy.totalAmountToAsset, tokenDecimals[strategy.fromAsset])).toFixed(4)
      } {strategy.assetToTitle}</b>
      </div>

    </div>
  );
};
