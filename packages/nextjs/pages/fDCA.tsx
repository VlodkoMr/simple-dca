import type { NextPage } from "next";
import { MetaHeader } from "~~/components/MetaHeader";
import React from "react";

const fDCA: NextPage = () => {

  return (
    <>
      <MetaHeader />

      <div className={"container max-w-4xl"}>
        <h2 className={"text-center mt-6 mb-4"}>fDCA Token</h2>

        <div className={"mb-3 text-center text-sm mb-8 max-w-xl mx-auto"}>
          fDCA is the DAO token for our project, distributed at a 1:1 ratio for every USD swapped on our platform. Notably, these tokens are
          non-transferrable, emphasizing their exclusive use within the DAO ecosystem. Designed for active participation, fDCA holders wield
          governance influence, contributing to decision-making processes and shaping the project's future.
        </div>

        <div className={"text-lg mt-10 mb-20 text-center"}>
          <p>My Balance: <span className={"font-bold"}>0 fDCA</span></p>
          <button className={"btn btn-gray-200 mt-4 rounded-full"} disabled>Snapshot DAO (coming soon)</button>
        </div>


      </div>
    </>
  );
};

export default fDCA;
