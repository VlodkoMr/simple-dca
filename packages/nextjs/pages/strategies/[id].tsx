import type { NextPage } from "next";
import { MetaHeader } from "~~/components/MetaHeader";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useScaffoldContractRead, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import { erc20ABI, useAccount, useContractReads, useNetwork } from "wagmi";
import { formatUnits } from "viem";
import { repeatOptions } from "~~/config/constants";
import { JoinStrategy } from "~~/components/modals/JoinStrategy";
import { DepositStrategy } from "~~/components/modals/DepositStrategy";
import { getTargetNetwork } from "~~/utils/scaffold-eth";

const OneStrategy: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { address } = useAccount();
  const { chain } = useNetwork();

  const { data: strategy } = useScaffoldContractRead({
    contractName: "FlexDCA",
    functionName: "getStrategy",
    chainId: chain?.id || getTargetNetwork().id,
    enabled: !!id,
    cacheOnBlock: true,
    watch: false,
    args: [id],
  });

  const { data: tokenDecimals } = useContractReads({
    contracts: [
      {
        address: strategy?.fromAsset,
        abi: erc20ABI,
        functionName: "decimals",
      },
      {
        address: strategy?.toAsset,
        abi: erc20ABI,
        functionName: "decimals",
      },
    ],
    enabled: !!id && !!strategy?.fromAsset && !!strategy?.toAsset,
    cacheTime: 5_000,
    watch: false,
    select: (data) => {
      let result: Record<string, number> = {};
      if (strategy) {
        result[strategy.fromAsset] = data[0].result as number;
        result[strategy.toAsset] = data[1].result as number;
      }
      return result;
    }
  });

  const { data: myStrategy, refetch: refetchMyStrategy } = useScaffoldContractRead({
    contractName: "FlexDCA",
    functionName: "getAllUserStrategies",
    chainId: chain?.id,
    args: [address],
    enabled: !!id && !!address,
    watch: false,
    select: (data) => {
      if (data) {
        return (data as UserStrategy[]).filter((userStrategy: UserStrategy) => userStrategy.strategyId === Number(id))[0];
      }
    }
  });

  const formatDate = (timestamp: number) => {
    return Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(timestamp * 1000);
  }

  const { writeAsync: claimWrite } = useScaffoldContractWrite({
    contractName: "FlexDCA",
    functionName: "claimTokens",
    args: [strategy?.id],
    enabled: !!strategy,
    onError: (error) => {
      alert(error);
    },
    onBlockConfirmation: (txnReceipt) => {
      console.log(`claimTokens txnReceipt`, txnReceipt);
      refetchMyStrategy();
      // toast(`Transaction blockHash ${txnReceipt.blockHash.slice(0, 10)}`);
    },
    onSuccess: (tx) => {
      if (tx) {
        console.log("Transaction sent: " + tx.hash);
      }
    }
  });

  const { writeAsync: exitWrite } = useScaffoldContractWrite({
    contractName: "FlexDCA",
    functionName: "exitStrategy",
    args: [strategy?.id],
    enabled: !!strategy,
    onError: (error) => {
      alert(error);
    },
    onBlockConfirmation: (txnReceipt) => {
      console.log(`depositWrite txnReceipt`, txnReceipt);
      refetchMyStrategy();
      // toast(`Transaction blockHash ${txnReceipt.blockHash.slice(0, 10)}`);
    },
    onSuccess: (tx) => {
      if (tx) {
        console.log("Transaction sent: " + tx.hash);
      }
    }
  });

  const handleClaim = () => {
    claimWrite();
  }

  const handleExit = () => {
    exitWrite();
  }

  return (
    <>
      <MetaHeader />

      {strategy && tokenDecimals && Object.keys(tokenDecimals).length > 0 ? (
        <>
          <section className="container page-hero pt-6 pb-4">
            <div className="row justify-center">
              <div className="lg:col-10 flex flex-row justify-between">
                <ul
                  className="breadcrumb inline-flex h-9 rounded-full btn btn-sm hover:bg-orange-100 p-0 mt-2"
                >
                  <li className="leading-none text-dark">
                    <Link href={"/strategies"} className={"px-5 block h-9 pt-2.5"}>
                      <small className="text-sm leading-none capitalize text-gray-600">&laquo; All Strategies</small>
                    </Link>
                  </li>
                </ul>

                <h2>{strategy.title}</h2>

                <div className={"px-4 pt-3 w-42 text-right leading-3"}>
                  {myStrategy && myStrategy?.isActive ? (
                    <div className={"mt-3 flex text-orange-500"}>
                      <span className={"text-xl leading-3 mr-2"}>•</span>
                      <div>strategy active</div>
                    </div>
                  ) : (
                    <div className={"mt-3 flex opacity-50"}>
                      <span className={"text-xl leading-3 mr-2"}>•</span>
                      <div>not active</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          <div className={"justify-center"}>
            <section className="integration-single section pt-0">
              <div className="container">
                <div className="row justify-center">
                  <div className="lg:col-10">
                    <div
                      className="integration-single-container rounded-xl bg-white py-10 px-5 shadow-lg md:px-10"
                    >
                      <p className={"text-center text-sm mb-6 max-w-xl mx-auto"}>
                        Effortlessly employ the Dollar Cost Averaging strategy for {strategy.title}: convert your
                        {" "}{strategy.assetFromTitle} to {strategy.assetToTitle} regularly on FlexDCA and earn fDCA rewards.
                      </p>

                      <div className="integrations-single-content px-4">

                        <div className="flex w-full mb-8">
                          <div
                            className={`
                            grid flex-grow card rounded-box place-items-center shadow-md shadow-gray-100 border
                            ${myStrategy && myStrategy?.isActive ? "bg-orange-50 border-orange-100" : "bg-base-300"}
                            `}>
                            <h3 className={"text-xl font-semibold mb-1 text-gray-700"}>{strategy.assetFromTitle}</h3>
                            <small className={"text-xsm block opacity-80"}>{strategy.fromAsset}</small>
                            {myStrategy && (
                              <p className={"font-semibold"}>
                                <span className={"mr-1"}>My Balance:</span>
                                {myStrategy?.amountLeft ? formatUnits(myStrategy?.amountLeft, tokenDecimals[strategy.fromAsset]) : "0"} {strategy.assetFromTitle}
                              </p>
                            )}
                          </div>
                          <div className={`
                          divider divider-horizontal font-semibold text-4xl
                          ${myStrategy && myStrategy?.isActive ? "text-orange-500 opacity-50" : "text-base-300"}
                          `}>&raquo;</div>
                          <div className={`
                          grid flex-grow card bg-base-300 rounded-box place-items-center shadow-md shadow-gray-100 border
                          ${myStrategy && myStrategy?.isActive ? "bg-orange-50 border-orange-100" : "bg-base-300"}
                          `}>
                            <h3 className={"text-xl font-semibold mb-1 text-gray-700"}>{strategy.assetToTitle}</h3>
                            <small className={"text-xsm block opacity-80"}>{strategy.toAsset}</small>
                            {myStrategy && (
                              <p className={"font-semibold"}>
                                <span className={"mr-1"}>My Balance:</span>
                                {myStrategy?.claimAvailable ? formatUnits(myStrategy?.claimAvailable, tokenDecimals[strategy.toAsset]) : "0"} {strategy.assetToTitle}
                              </p>
                            )}
                          </div>
                        </div>

                        <hr className={"opacity-50"} />

                        {myStrategy ? (
                          <>
                            <h5 className={"text-center mt-6"}>My Strategy</h5>

                            <div className={"flex justify-center"}>
                              {myStrategy?.claimAvailable > 0 && (
                                <button
                                  onClick={() => handleClaim()}
                                  className={"filter-btn btn btn-sm inline-block border border-gray-200 hover:bg-orange-100 hover:border-orange-200 text-dark"}>
                                  Claim {strategy.assetToTitle}
                                </button>
                              )}

                              {myStrategy?.amountLeft > 0 && (
                                <Link href={`/bridge?id=${strategy.id}`}
                                      className={"filter-btn btn btn-sm inline-block border border-gray-200 hover:bg-orange-100 hover:border-orange-200 text-dark"}>
                                  Bridge {strategy.assetFromTitle}
                                </Link>
                              )}

                              <button
                                onClick={() => document.getElementById('deposit_strategy_modal')?.showModal()}
                                className={"filter-btn btn btn-sm inline-block border border-gray-200 hover:bg-orange-100 hover:border-orange-200 text-dark"}>
                                Deposit {strategy.assetFromTitle}
                              </button>
                              <button
                                onClick={() => handleExit()}
                                className={"filter-btn btn btn-sm inline-block bg-red-100 border border-red-200 hover:bg-red-100 hover:border-red-400 text-dark"}>
                                Close & Exit
                              </button>
                            </div>

                            <div className={"flex flex-row gap-10 mt-5"}>
                              <div className={"flex-1 text-right"}>
                                <p>Status: {myStrategy.isActive ? "active" : "not active"}</p>
                                <p>Amount
                                  once: {formatUnits(myStrategy?.amountOnce, tokenDecimals[strategy.fromAsset])} {strategy.assetFromTitle}</p>
                              </div>
                              <div className={"flex-1 "}>
                                <p>Repeat: {repeatOptions[parseInt(myStrategy.executeRepeat) / 3600]}</p>
                                <p>Next execute: {formatDate(parseInt(myStrategy.nextExecute))}</p>
                              </div>
                            </div>

                          </>
                        ) : (
                          <div className={"text-center mt-6"}>
                            <button
                              disabled={!address}
                              onClick={() => document.getElementById('join_strategy_modal')?.showModal()}
                              className={"btn btn-sm rounded-full bg-orange-100 border-orange-200 hover:bg-orange-200 hover:border-orange-300"}>
                              Join Strategy
                            </button>
                          </div>
                        )}

                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <JoinStrategy strategy={strategy} onUpdate={() => refetchMyStrategy()} />
          <DepositStrategy strategy={strategy} onUpdate={() => refetchMyStrategy()} />
        </>
      ) : (
        <div className={"text-center"}>
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      )}

    </>
  );
};

export default OneStrategy;
