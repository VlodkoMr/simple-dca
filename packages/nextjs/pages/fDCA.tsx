import type {NextPage} from "next";
import {MetaHeader} from "~~/components/MetaHeader";
import React from "react";
import {useAccount, useBalance} from "wagmi";
import {getNetwork} from "@wagmi/core";
import {useDeployedContractInfo} from "~~/hooks/scaffold-eth";

const fDCA: NextPage = () => {
  const {chain} = getNetwork();
  const {address} = useAccount();
  const {data: tokenFDCAContract} = useDeployedContractInfo("TokenFDCA");

  console.log(`tokenFDCAContract?.address`, tokenFDCAContract?.address);

  const {data: balance} = useBalance({
    address: address,
    token: tokenFDCAContract?.address,
    chainId: chain?.id,
    enabled: !!address && !!tokenFDCAContract?.address,
  });

  console.log(`balance`, balance);

  return (
    <>
      <MetaHeader />

      <div className={"container max-w-4xl"}>
        <h2 className={"text-center mt-6 mb-1"}>fDCA Token</h2>
        <div className={"text-center"}>
          <b className={"block mb-4"}>Max supply: 10 000 000 fDCA</b>
        </div>

        <div className={"mb-3 text-center text-sm mb-8 max-w-xl mx-auto"}>
          fDCA is the designated DAO token, distributed at a 1:1 ratio for every USD swapped on our platform. Beyond DAO
          participation, fDCA serves as a versatile asset, enabling holders to access ecosystem rewards, participate in governance, and
          potentially unlock additional functionalities such as exclusive features or discounts within the broader platform.
        </div>

        <div className={"text-lg mt-10 mb-20 text-center"}>
          <p>My Balance: <span className={"font-bold"}>{balance?.formatted || 0} fDCA</span></p>
          <button className={"btn btn-gray-200 mt-4 rounded-full"} disabled>Snapshot DAO (coming soon)</button>
        </div>


      </div>
    </>
  );
};

export default fDCA;
