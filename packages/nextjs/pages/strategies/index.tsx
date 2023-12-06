import type {NextPage} from "next";
import {MetaHeader} from "~~/components/MetaHeader";
import {useScaffoldContractRead, useScaffoldContractWrite} from "~~/hooks/scaffold-eth";
import React, {useEffect, useMemo, useState} from "react";
import {useAccount} from "wagmi";
import {JoinStrategy} from "~~/components/modals/JoinStrategy";
import {useTokensDecimal} from "~~/hooks/useTokensDecimal";
import {DepositStrategy} from "~~/components/modals/DepositStrategy";
import {OneStrategy} from "~~/components/OneStrategy";

const Strategies: NextPage = () => {
  const {address} = useAccount();
  const [onlyMyStrategies, setOnlyMyStrategies] = useState(false);
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [joinStrategy, setJoinStrategy] = useState();
  const [depositStrategy, setDepositStrategy] = useState();
  const [myStrategiesObj, setMyStrategiesObj] = useState({});
  const [searchText, setSearchText] = useState("");

  const {data: allStrategies} = useScaffoldContractRead({
    contractName: "FlexDCA",
    functionName: "getAllStrategies",
    cacheTime: 5_000,
  });

  const {tokenDecimals} = useTokensDecimal({allStrategies});

  const {data: myStrategies} = useScaffoldContractRead({
    contractName: "FlexDCA",
    functionName: "getAllUserStrategies",
    args: [address],
    cacheTime: 3_000,
  });

  useEffect(() => {
    if (myStrategies) {
      const strategyObj: Record<number, UserStrategy> = {};
      myStrategies.map((userStrategy: UserStrategy) => {
        strategyObj[userStrategy.strategyId] = userStrategy;
      });
      setMyStrategiesObj(strategyObj);
    }
  }, [myStrategies]);

  const handleJoin = (e, strategy) => {
    e.stopPropagation();
    e.preventDefault();
    setJoinStrategy(strategy);
    document.getElementById('join_strategy_modal')?.showModal();
  }

  const allStrategiesFiltered = useMemo(() => {
    let strategies = allStrategies;
    if (onlyMyStrategies) {
      strategies = strategies?.filter((strategy) => myStrategiesObj[strategy.id]);
    }
    if (onlyAvailable) {
      strategies = strategies?.filter((strategy) => strategy.isActive);
    }
    if (searchText.length > 1) {
      let text = searchText.toLowerCase();
      strategies = strategies?.filter((strategy) => {
        if (strategy.title.toLowerCase().indexOf(text) !== -1) {
          return true;
        }
        if (strategy.assetFromTitle.toLowerCase().indexOf(text) !== -1) {
          return true;
        }
        return strategy.assetToTitle.toLowerCase().indexOf(text) !== -1;
      });
    }
    return strategies;
  }, [allStrategies, onlyMyStrategies, onlyAvailable, searchText]);

  const handleDeposit = (strategy) => {
    document.getElementById('deposit_strategy_modal')?.showModal();
    setDepositStrategy(strategy);
  }

  return (
    <>
      <MetaHeader />

      <div className={"container"}>
        <h2 className={"text-center mt-6 mb-4"}>Strategies</h2>

        <div className={"flex flex-row justify-between"}>
          <div className={"text-right flex flex-row gap-10 mt-2.5"}>
            <div className={"flex"}>
              <input type="checkbox"
                     className="toggle border-gray-300"
                     checked={onlyMyStrategies}
                     onChange={() => setOnlyMyStrategies(!onlyMyStrategies)}
              />
              <span className={"ml-2"}>My strategies</span>
            </div>
            <div className={"flex"}>
              <input type="checkbox"
                     className="toggle border-gray-300"
                     checked={onlyAvailable}
                     onChange={() => setOnlyAvailable(!onlyAvailable)}
              />
              <span className={"ml-2"}>Only available</span>
            </div>
          </div>

          <div>
            <input type="text"
                   placeholder="Search"
                   onChange={(e) => setSearchText(e.target.value)}
                   className="input w-full max-w-xs border-gray-300 text-sm rounded-full focus:outline-none focus:border-orange-400 transition"
            />
          </div>
        </div>

        <div className={"mt-2 flex w-full justify-between flex-nowrap px-8 py-4 text-sm font-semibold"}>
          <div className={"w-8"}>#</div>
          <div className={"w-1/6 min-w-32"}>Name</div>
          <div className={"w-24 text-right"}>From</div>
          <div className={"w-8"}></div>
          <div className={"w-24"}>To Asset</div>
          <div className={"w-1/6 min-w-32"}>Total Queue</div>
          <div className={"w-28"}>Status</div>
          <div className={"w-1/5"}>My Position</div>
          <div className={"w-32 text-right"}>Action</div>
        </div>


        {tokenDecimals && Object.keys(tokenDecimals).length > 0 && myStrategies ? (
          <div className={"mb-24"}>
            {allStrategiesFiltered?.map((strategy, index) => (
              <OneStrategy strategy={strategy}
                           key={index}
                           myStrategiesObj={myStrategiesObj}
                           handleDeposit={handleDeposit}
                           handleJoin={handleJoin}
                           index={index}
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

      <JoinStrategy strategy={joinStrategy} onUpdate={() => {
      }} />
      <DepositStrategy strategy={depositStrategy} onUpdate={() => {
      }} />
    </>
  );
};

export default Strategies;
