import React from "react";
import Link from "next/link";
import {formatUnits} from "viem";
import {EllipsisVerticalIcon} from "@heroicons/react/20/solid";
import {useScaffoldContractWrite} from "~~/hooks/scaffold-eth";


interface OneStrategyProps {
  strategy: Strategy;
  index: number;
  myStrategiesObj: Record<number, UserStrategy>;
  handleJoin: (e: any, strategy: Strategy) => void;
  handleDeposit: (strategy: Strategy) => void;
  tokenDecimals: Record<string, number> | undefined;
}

export const OneStrategy = ({
  strategy, index, tokenDecimals, myStrategiesObj, handleJoin, handleDeposit
}: OneStrategyProps) => {

  const [isMenuLoading, setIsMenuLoading] = React.useState(false);

  const {writeAsync: exitWrite} = useScaffoldContractWrite({
    contractName: "FlexDCA",
    functionName: "exitStrategy",
    args: [strategy.id],
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

  const {writeAsync: claimWrite} = useScaffoldContractWrite({
    contractName: "FlexDCA",
    functionName: "claimTokens",
    args: [strategy.id],
    onError: (error) => {
      alert(error);
      setIsMenuLoading(false);
    },
    onBlockConfirmation: (txnReceipt) => {
      setIsMenuLoading(false);
      console.log(`claimTokens txnReceipt`, txnReceipt);
      // toast(`Transaction blockHash ${txnReceipt.blockHash.slice(0, 10)}`);
    },
    onSuccess: (tx) => {
      setIsMenuLoading(true);
      if (tx) {
        console.log("Transaction sent: " + tx.hash);
      }
    }
  });

  const handleExit = () => {
    exitWrite();
  }

  const handleClaim = () => {
    claimWrite();
  }

  return (
    <Link href={`/strategies/${strategy.id}`} key={strategy.id}
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
        <div className={"w-28 text-sm leading-10"}>
          {strategy.active ? ("available") : ("filled")}
        </div>
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
                {isMenuLoading ? (
                  <span className="loading loading-spinner loading-xs opacity-50"></span>
                ) : (
                  <EllipsisVerticalIcon width={16} height={16} />
                )}
              </div>
              {!isMenuLoading && (
                <ul className="dropdown-content z-[1] menu p-2 text-gray-600 shadow bg-base-100 rounded-box w-52">
                  <li onClick={() => handleDeposit(strategy)}><span>Deposit</span></li>
                  {
                    myStrategiesObj[strategy.id]?.claimAvailable > 0 && (
                      <li onClick={() => handleClaim(strategy)}><span>Claim {strategy.assetToTitle}</span></li>
                    )
                  }
                  <li onClick={() => handleExit(strategy)}><span className={"text-red-400"}>Close & Exit</span></li>
                </ul>
              )}

            </div>
          ) : (
            <>
              {strategy.active && (
                <button
                  className={"btn btn-sm border-white rounded-full hover:bg-orange-300 hover:border-orange-400 px-6 outline-none"}
                  onClick={(e) => handleJoin(e, strategy)}>
                  Join
                </button>
              )}
            </>
          )}
        </div>
      </div>

    </Link>
  );
};
