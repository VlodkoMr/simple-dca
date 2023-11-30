import type { NextPage } from "next";
import { MetaHeader } from "~~/components/MetaHeader";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";
import { all } from "deepmerge";
import React, { useState } from "react";
import { BottomBanner } from "~~/components/BottomBanner";

const Strategies: NextPage = () => {
  const [onlyMyStrategies, setOnlyMyStrategies] = useState(false);
  const [onlyAvailable, setOnlyAvailable] = useState(false);


  const { data: allStrategies } = useScaffoldContractRead({
    contractName: "FlexDCA",
    functionName: "getAllStrategies",
  });

  console.log(`allStrategies`, allStrategies);

  return (
    <>
      <MetaHeader />

      <div className={"container"}>
        <div className={"flex flex-row justify-between mb-2"}>
          <h2>DCA Strategies</h2>

          <div className={"text-right flex flex-row gap-10 mt-4"}>
            <div className={"flex"}>
              <input type="checkbox"
                     className="toggle"
                     checked={onlyMyStrategies}
                     onChange={() => setOnlyMyStrategies(!onlyMyStrategies)}
              />
              <span className={"ml-2"}>My strategies</span>
            </div>
            <div className={"flex"}>
              <input type="checkbox"
                     className="toggle"
                     checked={onlyAvailable}
                     onChange={() => setOnlyAvailable(!onlyAvailable)}
              />
              <span className={"ml-2"}>Only available</span>
            </div>
          </div>
        </div>

        {allStrategies?.map((strategy: any) => (
          <div className={"rounded-lg bg-white px-8 py-4 shadow-sm mb-2"}>
            +
          </div>
        ))}

        <BottomBanner />

      </div>
    </>
  );
};

export default Strategies;
