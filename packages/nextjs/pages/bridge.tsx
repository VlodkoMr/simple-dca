import type {NextPage} from "next";
import {MetaHeader} from "~~/components/MetaHeader";
import React, {useEffect, useState} from "react";
import {getNetwork} from "@wagmi/core";
import {useScaffoldContractRead} from "~~/hooks/scaffold-eth";
import {useTokensDecimal} from "~~/hooks/useTokensDecimal";
import {useAccount} from "wagmi";
import {formatUnits} from "viem";

const DestinationSection = () => {
  const network = getNetwork();
  const [destinationChainId, setDestinationChainId] = useState();

  const {data: allStrategies} = useScaffoldContractRead({
    contractName: "FlexDCA",
    functionName: "getAllStrategies",
    cacheTime: 5_000,
    watch: false,
    chainId: destinationChainId,
    enabled: !!destinationChainId
  });

  console.log(`allStrategies`, allStrategies);

  useEffect(() => {
    console.log(`network.chain`, network.chain);
    if (network.chain) {
      const availableChains = network.chains.filter(chain => chain.id != network.chain.id);
      setDestinationChainId(parseInt(availableChains[0].id));
      console.log(`availableChains`, availableChains[0]);
    }
  }, []);

  useEffect(() => {
    if (destinationChainId) {
      console.log(`destinationChainId`, destinationChainId);
    }
  }, [destinationChainId]);

  return (
    <div className="flex flex-grow card bg-base-200 rounded-box place-items-center shadow-md w-1/2">
      <h5 className={"border-b-2 w-full text-center pb-2 mb-8"}>
        Destination chain:
        <span className={"text-orange-600 ml-2"}>
                  <select onChange={(e) => setDestinationChainId(parseInt(e.target.value))}
                          value={destinationChainId}
                          className="select select-sm select-bordered font-normal max-w-xs rounded-full focus:outline-none ">
                    {network.chains.filter(chain => chain.id != network.chain.id).map((chain) => (
                      <option key={chain.id} value={parseInt(chain.id)}>{chain.name}</option>
                    ))}
                  </select>
                </span>
      </h5>

      <div className={"mb-3 flex gap-4 w-full flex-row"}>
        <b className={"w-1/2 block text-right pt-1"}>Destination strategy:</b>
        <select onChange={(e) => console.log(e.target.value)}
                className="select select-sm w-1/2 select-bordered font-normal max-w-xs rounded-full focus:outline-none mr-10">
          <option>1</option>
        </select>
      </div>
    </div>
  )
}

const Bridge: NextPage = () => {
  const network = getNetwork();
  const {address} = useAccount();
  const [myStrategiesObj, setMyStrategiesObj] = useState({});

  console.log(`network`, network);

  const {data: allStrategies} = useScaffoldContractRead({
    contractName: "FlexDCA",
    functionName: "getAllStrategies",
    cacheTime: 5_000,
    watch: false
  });

  const {tokenDecimals} = useTokensDecimal({allStrategies});

  const {data: myStrategies} = useScaffoldContractRead({
    contractName: "FlexDCA",
    functionName: "getAllUserStrategies",
    args: [address],
    cacheTime: 3_000,
    watch: false
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

  console.log(`tokenDecimals`, tokenDecimals);
  console.log(`myStrategiesObj`, myStrategiesObj);

  return (
    <>
      <MetaHeader />

      <div className={"container"}>
        <h2 className={"text-center mt-6 mb-4"}>Bridge</h2>
        <p className={"text-center text-sm mb-8 max-w-xl mx-auto"}>
          Effortlessly shift assets between blockchains and diversify your DCA strategy with our
          cutting-edge Token Bridge feature, powered by Chainlink CCIP.
        </p>

        {network.chain && (
          <>
            <div className={"flex flex-row justify-between mb-6"}>
              <div className="flex flex-col w-full lg:flex-row">

                <div className="flex flex-grow card bg-base-200 rounded-box place-items-center shadow-md w-1/2">
                  <h5 className={"border-b-2 w-full text-center pb-3 mb-8"}>
                    Source chain:
                    <span className={"text-orange-600 ml-2"}>{network.chain.name}</span>
                  </h5>

                  <div className={"mb-3 flex gap-4 w-full flex-row"}>
                    <b className={"w-1/2 block text-right pt-1"}>Choose active strategy:</b>
                    {allStrategies && myStrategiesObj && tokenDecimals && (
                      <select onChange={(e) => console.log(e.target.value)}
                              className="select select-sm w-1/2 select-bordered font-normal max-w-xs rounded-full focus:outline-none mr-10">
                        {allStrategies.filter(strategy => myStrategiesObj[strategy.id]).map((strategy) => (
                          <option disabled={parseFloat(myStrategiesObj[strategy.id].amountLeft) == 0}>
                            {strategy.title} ({myStrategiesObj[strategy.id].amountLeft ? formatUnits(myStrategiesObj[strategy.id].amountLeft, tokenDecimals[strategy.fromAsset]) : "0"} {strategy.assetFromTitle})
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  <div className={"mb-3 flex gap-4 w-full flex-row"}>
                    <b className={"w-1/2 block text-right pt-1"}>Transfer amount:</b>
                    <input type="number" min={"1"} className={"border border-gray-300 rounded-full p-0.5 w-1/2 mr-10 focus:outline-none px-3"} />
                  </div>
                </div>

                <div className="divider lg:divider-horizontal text-4xl">&raquo;</div>

                <DestinationSection />
              </div>
            </div>

            <div className={"text-center mb-20"}>
              <button
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
