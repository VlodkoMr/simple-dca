import type {NextPage} from "next";
import {MetaHeader} from "~~/components/MetaHeader";
import React from "react";
import {getNetwork} from "@wagmi/core";

const Bridge: NextPage = () => {
  const network = getNetwork();

  console.log(`network`, network);

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

                <div className="grid flex-grow card bg-base-200 rounded-box place-items-center shadow-md w-1/2">
                  <h5 className={"border-b-2 w-full text-center pb-3 mb-4"}>
                    Source chain:
                    <span className={"text-orange-600 ml-2"}>{network.chain.name}</span>
                  </h5>

                  <div>
                    <b>Choose active strategy:</b>
                    <select onChange={(e) => console.log(e.target.value)}
                            className="select select-sm select-bordered font-normal max-w-xs rounded-full focus:outline-none text-lg">
                      <option>1</option>
                    </select>
                  </div>

                  <div>
                    <b>Transfer amount:</b>
                    <input type="number" />
                  </div>
                </div>

                <div className="divider lg:divider-horizontal text-4xl">&raquo;</div>

                <div className="grid flex-grow card bg-base-200 rounded-box place-items-center shadow-md w-1/2">
                  <h5 className={"border-b-2 w-full text-center pb-2 mb-4"}>
                    Destination chain:
                    <span className={"text-orange-600 ml-2"}>
                  <select onChange={(e) => console.log(e.target.value)}
                          className="select select-sm select-bordered font-normal max-w-xs rounded-full focus:outline-none text-lg -mt-1">
                    {network.chains.filter(chain => chain.id != network.chain.id).map((chain) => (
                      <option key={chain.id}>{chain.name}</option>
                    ))}
                  </select>
                </span>
                  </h5>

                  <div>
                    <div>
                      <b>Choose destination strategy:</b>
                      <select onChange={(e) => console.log(e.target.value)}
                              className="select select-sm select-bordered font-normal max-w-xs rounded-full focus:outline-none text-lg">
                        <option>1</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={"text-center mb-20"}>
              <button
                className={"btn btn-sm bg-orange-200 border-orange-300 rounded-full hover:bg-orange-300 hover:border-orange-400 outline-none"}>
                Bridge
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Bridge;
