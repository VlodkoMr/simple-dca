import type { NextPage } from "next";
import { MetaHeader } from "~~/components/MetaHeader";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";

const Strategies: NextPage = () => {
  const { data: allStrategies } = useScaffoldContractRead({
    contractName: "FlexDCA",
    functionName: "getAllStrategies",
  });

  console.log(`allStrategies`, allStrategies);

  return (
    <>
      <MetaHeader />

      <div className={"container"}>strategies</div>
    </>
  );
};

export default Strategies;
