import type {NextPage} from "next";
import {MetaHeader} from "~~/components/MetaHeader";
import React, {useEffect, useMemo, useState} from "react";
import {getNetwork} from "@wagmi/core";
import {useDeployedContractInfo, useScaffoldContractRead, useScaffoldContractWrite} from "~~/hooks/scaffold-eth";
import {useTokensDecimal} from "~~/hooks/useTokensDecimal";
import {useAccount, useBalance} from "wagmi";
import {formatUnits, parseUnits} from "viem";

const destinationChainSelectorMap = {
  11155111: "16015286601757825753", // sepolia
  43114: "6433500567565415381", // avalanche
  137: "4051577828743386545", // polygon
  80001: "12532609583862916517", // mumbai
}

const DestinationSection = ({destinationChainId, setDestinationChainId, destinationStrategyId, setDestinationStrategyId}: {
  destinationChainId: number | undefined;
  setDestinationChainId: (destinationChainId: number) => void;
  destinationStrategyId: number | undefined;
  setDestinationStrategyId: (destinationStrategyId: number) => void;
}) => {
  const {chain, chains} = getNetwork();
  const {address} = useAccount();
  const [myExtStrategiesObj, setMyExtStrategiesObj] = useState({});

  const {data: allExtStrategies} = useScaffoldContractRead({
    contractName: "FlexDCA",
    functionName: "getAllStrategies",
    cacheTime: 5_000,
    watch: false,
    chainId: destinationChainId,
    enabled: !!destinationChainId
  });

  const {data: myExtStrategies} = useScaffoldContractRead({
    contractName: "FlexDCA",
    functionName: "getAllUserStrategies",
    args: [address],
    cacheTime: 3_000,
    watch: false,
    chainId: destinationChainId,
    enabled: !!destinationChainId
  });

  useEffect(() => {
    if (chain) {
      const availableChains = chains.filter(c => c.id != chain.id);
      setDestinationChainId(parseInt(availableChains[0].id));
    }
  }, []);

  useEffect(() => {
    if (myExtStrategies) {
      const strategyObj: Record<number, UserStrategy> = {};
      myExtStrategies.map((userStrategy: UserStrategy) => {
        strategyObj[userStrategy.strategyId] = userStrategy;
      });
      setMyExtStrategiesObj(strategyObj);
    }
  }, [myExtStrategies]);

  return (
    <div className="flex flex-grow card bg-base-200 rounded-box place-items-center shadow-md w-1/2">
      <h5 className={"border-b-2 w-full text-center pb-2 mb-8"}>
        Destination chain:
        <span className={"text-orange-600 ml-2"}>
          <select onChange={(e) => setDestinationChainId(parseInt(e.target.value))}
                  value={destinationChainId}
                  className="select select-sm select-bordered font-normal max-w-xs rounded-full focus:outline-none ">
            {chains.filter(c => c.id != chain?.id).map((chain) => (
              <option disabled={!destinationChainSelectorMap[chain.id]} key={chain.id} value={parseInt(chain.id)}>
                {chain.name}
                {!destinationChainSelectorMap[chain.id] && (" (coming soon)")}
              </option>
            ))}
          </select>
        </span>
      </h5>

      <div className={"mb-3 flex gap-4 w-full flex-row"}>
        <b className={"w-1/2 block text-right pt-1"}>Destination strategy:</b>

        <div className={"w-1/2 mr-10"}>
          {myExtStrategiesObj && myExtStrategies && allExtStrategies && allExtStrategies.filter(strategy => myExtStrategiesObj[strategy.id]).length > 0 ? (
            <>
              <select onChange={(e) => setDestinationStrategyId(parseInt(e.target.value))}
                      value={destinationStrategyId}
                      className="select select-sm w-full select-bordered font-normal max-w-xs rounded-full focus:outline-none">
                <option disabled selected>Please select a strategy</option>
                {allExtStrategies.filter(strategy => myExtStrategiesObj[strategy.id]).map((strategy) => (
                  <option value={strategy.id}>{strategy.title}</option>
                ))}
              </select>
            </>
          ) : (
            <small className={"pt-2 block"}>
              *no active strategies
            </small>
          )}
        </div>

      </div>
    </div>
  )
}

const Bridge: NextPage = () => {
  const {chain} = getNetwork();
  const {address} = useAccount();
  const [myStrategiesObj, setMyStrategiesObj] = useState({});
  const [bridgeAmount, setBridgeAmount] = useState();
  const [destinationChainId, setDestinationChainId] = useState();
  const [destinationStrategyId, setDestinationStrategyId] = useState();
  const [currentStrategyId, setCurrentStrategyId] = useState();

  const {data: allStrategies} = useScaffoldContractRead({
    contractName: "FlexDCA",
    functionName: "getAllStrategies",
    cacheTime: 5_000,
    watch: false,
    chainId: chain?.id,
  });

  const {tokenDecimals} = useTokensDecimal({allStrategies});

  const {data: myStrategies} = useScaffoldContractRead({
    contractName: "FlexDCA",
    functionName: "getAllUserStrategies",
    args: [address],
    cacheTime: 3_000,
    watch: false,
    chainId: chain?.id,
  });

  const {data: destinationContract} = useDeployedContractInfo("Bridge", destinationChainId);

  const bridgeAmountWei = useMemo(() => {
    if (bridgeAmount) {
      let fromAsset = '';
      allStrategies.map((strategy) => {
        if (parseInt(strategy.id) === currentStrategyId) {
          fromAsset = strategy.fromAsset;
        }
      });

      return parseUnits(bridgeAmount.toString(), tokenDecimals[fromAsset]);
    }
    return 0;
  }, [bridgeAmount, currentStrategyId]);

  console.log(`[
      destinationChainSelectorMap[destinationChainId],
      destinationContract?.address,
      currentStrategyId,
      destinationStrategyId,
      bridgeAmountWei,
    ]`, [
    destinationChainSelectorMap[destinationChainId],
    destinationContract?.address,
    currentStrategyId,
    destinationStrategyId,
    bridgeAmountWei,
  ]);

  const {writeAsync: bridgeWrite} = useScaffoldContractWrite({
    contractName: "FlexDCA",
    functionName: "bridgeTokens",
    args: [
      destinationChainSelectorMap[destinationChainId],
      destinationContract?.address,
      currentStrategyId,
      destinationStrategyId,
      bridgeAmountWei,
    ],
    enabled: !!destinationChainId && !!destinationContract?.address && !!bridgeAmount,
    onError: (error) => {
      alert(error);
      setIsMenuLoading(false);
    },
    onBlockConfirmation: (txnReceipt) => {
      console.log(`depositWrite txnReceipt`, txnReceipt);
      setIsMenuLoading(false);
      // toast(`Transaction blockHash ${txnReceipt.blockHash.slice(0, 10)}`);
    },
    onSuccess: (tx) => {
      setIsMenuLoading(true);
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

  const handleBridge = () => {
    let fromAsset = '';
    let fromAssetTitle = '';
    allStrategies.map((strategy) => {
      if (parseInt(strategy.id) === currentStrategyId) {
        fromAsset = strategy.fromAsset;
        fromAssetTitle = strategy.assetFromTitle;
      }
    });

    const maxAmount = formatUnits(myStrategiesObj[currentStrategyId].amountLeft, tokenDecimals[fromAsset]);
    if (parseFloat(bridgeAmount) > parseFloat(maxAmount)) {
      alert(`You can only bridge ${maxAmount} ${fromAssetTitle} from this strategy.`);
      return;
    }

    bridgeWrite();
  }

  return (
    <>
      <MetaHeader />

      <div className={"container"}>
        <h2 className={"text-center mt-6 mb-4"}>Bridge</h2>
        <p className={"text-center text-sm mb-8 max-w-xl mx-auto"}>
          Effortlessly shift assets between blockchains and diversify your DCA strategy with our
          cutting-edge Token Bridge feature, powered by Chainlink CCIP.
        </p>

        {chain && (
          <>
            <div className={"flex flex-row justify-between mb-6"}>
              <div className="flex flex-col w-full lg:flex-row">

                <div className="flex flex-grow card bg-base-200 rounded-box place-items-center shadow-md w-1/2">
                  <h5 className={"border-b-2 w-full text-center pb-3 mb-8"}>
                    Source chain:
                    <span className={"text-orange-600 ml-2"}>{chain?.name}</span>
                  </h5>

                  <div className={"mb-3 flex gap-4 w-full flex-row"}>
                    <b className={"w-1/2 block text-right pt-1"}>Choose active strategy:</b>

                    <div className={"w-1/2 mr-10"}>
                      {Object.keys(myStrategiesObj).length > 0 ? (
                        <>
                          {allStrategies && myStrategiesObj && tokenDecimals && (
                            <select onChange={(e) => setCurrentStrategyId(parseInt(e.target.value))}
                                    value={currentStrategyId}
                                    className="select select-sm w-full select-bordered font-normal max-w-xs rounded-full focus:outline-none">
                              <option disabled selected>Please select a strategy</option>
                              {allStrategies.filter(strategy => myStrategiesObj[strategy.id]).map((strategy) => (
                                <option value={strategy.id} disabled={parseFloat(myStrategiesObj[strategy.id].amountLeft) == 0}>
                                  {strategy.title} ({myStrategiesObj[strategy.id].amountLeft ? formatUnits(myStrategiesObj[strategy.id].amountLeft, tokenDecimals[strategy.fromAsset]) : "0"} {strategy.assetFromTitle})
                                </option>
                              ))}
                            </select>
                          )}
                        </>
                      ) : (
                        <small className={"pt-2 block"}>
                          *no active strategies
                        </small>
                      )}
                    </div>
                  </div>

                  <div className={"mb-3 flex gap-4 w-full flex-row"}>
                    <b className={"w-1/2 block text-right pt-1"}>Transfer amount:</b>
                    <input type="number"
                           min={1}
                           value={bridgeAmount}
                           onChange={(e) => setBridgeAmount(parseFloat(e.target.value))}
                           className={"border border-gray-300 rounded-full p-0.5 w-1/2 mr-10 focus:outline-none px-3"}
                    />
                  </div>
                </div>

                <div className="divider lg:divider-horizontal text-4xl">&raquo;</div>

                <DestinationSection
                  destinationChainId={destinationChainId}
                  setDestinationChainId={setDestinationChainId}
                  destinationStrategyId={destinationStrategyId}
                  setDestinationStrategyId={setDestinationStrategyId}
                />
              </div>
            </div>

            <div className={"text-center mb-20"}>
              <button
                disabled={bridgeAmount == 0 || !destinationStrategyId || !currentStrategyId}
                onClick={() => handleBridge()}
                className={"btn bg-orange-200 border-orange-300 rounded-full hover:bg-orange-300 hover:border-orange-400 outline-none"}>
                Bridge Tokens
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Bridge;
