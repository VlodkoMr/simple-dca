import React from "react";
import { formatUnits } from "viem";

interface OneStrategyProps {
  strategy: Strategy;
  myStrategiesObj: Record<number, UserStrategy>;
  tokenDecimals: Record<string, number> | undefined;
}

export const OneStrategyStats = ({ strategy, tokenDecimals }: OneStrategyProps) => {
  console.log(`strategy`, strategy);

  return (
    <div
      key={strategy.id}
      className={"block flex-1 min-w-64 rounded-lg bg-white px-8 py-4 shadow-sm mb-2 border border-white transition"}
    >
      <div className={"flex flex-row flex-nowrap justify-between border-b mb-3"}>
        <div className={"font-semibold text-xl text-gray-700 uppercase mt-1"}>{strategy.title}</div>
        <div className={"text-sm leading-10 text-right opacity-70"}>{strategy.isActive ? "available" : "filled"}</div>
      </div>

      {tokenDecimals && (
        <>
          <div>
            Assets in queue:{" "}
            <b>
              {parseFloat(formatUnits(BigInt(strategy.totalBalance), tokenDecimals[strategy.fromAsset])).toFixed(2)}{" "}
              {strategy.assetFromTitle}
            </b>
          </div>
          <div>
            Total spent:{" "}
            <b>
              {parseFloat(
                formatUnits(BigInt(strategy.totalAmountFromAsset), tokenDecimals[strategy.fromAsset]),
              ).toFixed(2)}{" "}
              {strategy.assetFromTitle}
            </b>
          </div>
          <div>
            Total received:{" "}
            <b>
              {parseFloat(formatUnits(BigInt(strategy.totalAmountToAsset), tokenDecimals[strategy.fromAsset])).toFixed(
                4,
              )}{" "}
              {strategy.assetToTitle}
            </b>
          </div>

          {parseFloat(strategy.totalAmountToAsset) > 0 && (
            <div>
              Average price:
              <b>
                {parseFloat(
                  formatUnits(
                    BigInt(strategy.totalAmountFromAsset) / BigInt(strategy.totalAmountToAsset),
                    tokenDecimals[strategy.fromAsset],
                  ),
                ).toFixed(4)}
              </b>
            </div>
          )}
        </>
      )}
    </div>
  );
};
