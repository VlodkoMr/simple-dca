import type { NextPage } from "next";
import { MetaHeader } from "~~/components/MetaHeader";
import { useAccount, useNetwork } from "wagmi";
import React, { useEffect, useMemo, useState } from "react";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";
import { useTokensDecimal } from "~~/hooks/useTokensDecimal";
import { OneStrategyStats } from "~~/components/OneStrategyStats";
import { formatUnits } from "viem";
import { getTargetNetwork } from "~~/utils/scaffold-eth";

const Statistic: NextPage = () => {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const [myStrategiesObj, setMyStrategiesObj] = useState({});

  const { data: allStrategies } = useScaffoldContractRead({
    contractName: "FlexDCA",
    functionName: "getAllStrategies",
    cacheTime: 5_000,
    chainId: chain?.id || getTargetNetwork().id,
  });

  const { tokenDecimals } = useTokensDecimal({ allStrategies });

  const { data: myStrategies } = useScaffoldContractRead({
    contractName: "FlexDCA",
    functionName: "getAllUserStrategies",
    args: [address],
    cacheTime: 3_000,
    chainId: chain?.id,
  });

  const totalQueue = useMemo(() => {
    let total = 0;
    if (tokenDecimals && allStrategies) {
      allStrategies?.map((strategy) => {
        total += parseFloat(formatUnits(strategy.totalBalance, tokenDecimals[strategy.fromAsset]));
      });
    }

    return total;
  }, [allStrategies, tokenDecimals]);

  const totalProcessed = useMemo(() => {
    let total = 0;
    if (tokenDecimals && allStrategies) {
      allStrategies?.map((strategy) => {
        total += parseFloat(formatUnits(strategy.totalAmountFromAsset, tokenDecimals[strategy.fromAsset]));
      });
    }

    return total;
  }, [allStrategies, tokenDecimals]);

  useEffect(() => {
    if (myStrategies) {
      const strategyObj: Record<number, UserStrategy> = {};
      myStrategies.map((userStrategy: UserStrategy) => {
        strategyObj[userStrategy.strategyId] = userStrategy;
      });
      setMyStrategiesObj(strategyObj);
    }
  }, [myStrategies]);

  return (
    <>
      <MetaHeader />

      <div className={"container "}>
        <h2 className={"text-center mt-6 mb-4"}>Statistic</h2>

        <div className={"flex justify-center gap-10 mb-10"}>
          <p>Pools: <b>{allStrategies?.length}</b></p>
          <p>Stables in queue: <b>{totalQueue} USD</b></p>
          <p>Processed stables: <b>{totalProcessed} USD</b></p>
        </div>

        {tokenDecimals && Object.keys(tokenDecimals).length > 0 ? (
          <div className={"mb-24 flex flex-wrap flex-row gap-10 justify-center"}>
            {allStrategies?.map((strategy, index) => (
              <OneStrategyStats strategy={strategy}
                                key={index}
                                myStrategiesObj={myStrategiesObj}
                                tokenDecimals={tokenDecimals}
              />
            ))}
          </div>
        ) : (
          <div className={"text-center"}>
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        )}
      </div>
    </>
  );
};

export default Statistic;
