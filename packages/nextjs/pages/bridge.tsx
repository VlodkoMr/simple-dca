import type { NextPage } from "next";
import { MetaHeader } from "~~/components/MetaHeader";
import React from "react";

const Bridge: NextPage = () => {
  return (
    <>
      <MetaHeader />

      <div className={"container"}>
        <h2 className={"text-center mt-6 mb-4"}>Bridge</h2>
        <p className={"text-center text-sm mb-8 max-w-xl mx-auto"}>
          Effortlessly shift assets between blockchains and diversify your DCA strategy with our
          cutting-edge Token Bridge feature, powered by Chainlink CCIP.
        </p>

        <div className={"flex flex-row justify-between mb-20"}>
          <div className="flex flex-col w-full lg:flex-row">
            <div className="grid flex-grow h-32 card bg-base-300 rounded-box place-items-center">
              content
            </div>
            <div className="divider lg:divider-horizontal text-4xl">&raquo;</div>
            <div className="grid flex-grow h-32 card bg-base-300 rounded-box place-items-center">
              content
            </div>
          </div>
        </div>


      </div>
    </>
  );
};

export default Bridge;
