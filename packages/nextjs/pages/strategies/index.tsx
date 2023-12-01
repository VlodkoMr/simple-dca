import type {NextPage} from "next";
import {MetaHeader} from "~~/components/MetaHeader";
import {useScaffoldContractRead, useScaffoldContractWrite} from "~~/hooks/scaffold-eth";
import React, {useEffect, useMemo, useState} from "react";
import {useAccount} from "wagmi";
import Link from "next/link";
import {JoinStrategy} from "~~/components/modals/JoinStrategy";
import {EllipsisVerticalIcon} from "@heroicons/react/20/solid";
import {useTokensDecimal} from "~~/hooks/useTokensDecimal";
import {formatUnits} from "viem";
import {DepositStrategy} from "~~/components/modals/DepositStrategy";

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

  const {writeAsync: exitWrite} = useScaffoldContractWrite({
    contractName: "FlexDCA",
    functionName: "exitStrategy",
    onError: (error) => {
      alert(error);
    },
    onBlockConfirmation: (txnReceipt) => {
      console.log(`depositWrite txnReceipt`, txnReceipt);
      // toast(`Transaction blockHash ${txnReceipt.blockHash.slice(0, 10)}`);
    },
    onSuccess: (tx) => {
      if (tx) {
        console.log("Transaction sent: " + tx.hash);
      }
    }
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

  console.log(`myStrategiesObj`, myStrategiesObj);

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
      strategies = strategies?.filter((strategy) => strategy.active);
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

  const handleClaim = (strategy) => {
    console.log(`strategy`, strategy);
  }

  const handleExit = (strategy) => {
    console.log(`strategy`, strategy);
    exitWrite({
      args: [strategy.id],
    });
  }

  return (
    <>
      <MetaHeader />

      <div className={"container"}>
        <h2 className={"text-center"}>Strategies</h2>

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
          <div className={"w-8"}></div>
          <div className={"w-1/6 min-w-32"}>Name</div>
          <div className={"w-24 text-right"}>From</div>
          <div className={"w-8"}></div>
          <div className={"w-24"}>To Asset</div>
          <div className={"w-1/6 min-w-32"}>Total Queue</div>
          <div className={"w-28"}>Status</div>
          <div className={"w-1/5"}>My Position</div>
          <div className={"w-32 text-right"}></div>
        </div>

        <div className={"mb-24"}>
          {allStrategiesFiltered?.map((strategy, index) => (
            <Link href={`/strategies/${strategy.id}`} key={index}
                  className={"block rounded-lg bg-white px-8 py-3 shadow-sm mb-2 border border-white hover:border-orange-200 hover:text-orange-600 transition"}>
              <div className={"flex w-full justify-between flex-nowrap leading-10"}>
                <div className={"w-8 opacity-70"}>
                  <span className={"text-sm"}>#{index + 1}</span>
                </div>
                <div className={"w-1/6 min-w-32 font-semibold text-gray-700"}>{strategy.title}</div>
                <div className={"w-24 text-right"}>{strategy.assetFromTitle}</div>
                <div className={"w-8 text-center"}>&raquo;</div>
                <div className={"w-24"}>{strategy.assetToTitle}</div>
                <div className={"w-1/6 min-w-32"}>
                  {formatUnits(strategy.totalBalance, tokenDecimals[strategy.fromAsset])} {strategy.assetFromTitle}
                </div>
                <div className={"w-28 text-sm leading-10"}>available</div>
                <div className={`w-1/5 text-sm ${!myStrategiesObj[strategy.id]?.amountLeft || !myStrategiesObj[strategy.id]?.claimAvailable && 'leading-10'}`}>
                  {myStrategiesObj[strategy.id]?.amountLeft > 0 && (
                    <p>
                      {
                        formatUnits(myStrategiesObj[strategy.id]?.amountLeft, tokenDecimals[strategy.fromAsset])
                      } {strategy.assetFromTitle} in queue
                    </p>
                  )}
                  {myStrategiesObj[strategy.id]?.claimAvailable > 0 && (
                    <p>{myStrategiesObj[strategy.id]?.claimAvailable} {strategy.assetToTitle} available</p>
                  )}
                </div>
                <div className={"w-32 text-right leading-3"}>
                  {myStrategiesObj[strategy.id] ? (
                    <div className="dropdown dropdown-hover dropdown-end" onClick={(e) => e.preventDefault()}>
                      <div tabIndex="0" role="button" className="btn btn-sm rounded-full p-3">
                        <EllipsisVerticalIcon width={16} height={16} />
                      </div>
                      <ul className="dropdown-content z-[1] menu p-2 text-gray-600 shadow bg-base-100 rounded-box w-52">
                        <li onClick={() => handleDeposit(strategy)}><span>Deposit</span></li>
                        {
                          myStrategiesObj[strategy.id]?.claimAvailable > 0 && (
                            <li onClick={() => handleClaim(strategy)}><span>Claim {strategy.assetToTitle}</span></li>
                          )
                        }
                        <li onClick={() => handleExit(strategy)}><span className={"text-red-400"}>Close & Exit</span></li>
                      </ul>
                    </div>
                  ) : (
                    <button
                      className={"btn btn-sm border-white rounded-full hover:bg-orange-300 hover:border-orange-400 px-6 outline-none"}
                      onClick={(e) => handleJoin(e, strategy)}>
                      Join
                    </button>
                  )}
                </div>
              </div>

            </Link>
          ))}
        </div>
      </div>

      <JoinStrategy strategy={joinStrategy} />
      <DepositStrategy strategy={depositStrategy} />
    </>
  );
};

export default Strategies;
