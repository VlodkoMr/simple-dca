import type {NextPage} from "next";
import {MetaHeader} from "~~/components/MetaHeader";
import {useScaffoldContractRead} from "~~/hooks/scaffold-eth";
import React, {useState} from "react";
import {BottomBanner} from "~~/components/BottomBanner";
import {EllipsisVerticalIcon} from "@heroicons/react/20/solid";
import {useAccount} from "wagmi";
import Link from "next/link";
import {JoinStrategy} from "~~/components/JoinStrategy";

const Strategies: NextPage = () => {
  const {address} = useAccount();
  const [onlyMyStrategies, setOnlyMyStrategies] = useState(false);
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  const {data: allStrategies} = useScaffoldContractRead({
    contractName: "FlexDCA",
    functionName: "getAllStrategies",
  });

  const {data: myStrategies} = useScaffoldContractRead({
    contractName: "FlexDCA",
    functionName: "getAllUserStrategies",
    args: [address],
  });

  console.log(`allStrategies`, allStrategies);
  console.log(`myStrategies`, myStrategies);

  return (
    <>
      <MetaHeader />

      <div className={"container"}>
        <h2 className={"text-center"}>Strategies</h2>

        <div className={"flex flex-row justify-between"}>
          <div className={"text-right flex flex-row gap-10 mt-2.5"}>
            <div className={"flex"}>
              <input type="checkbox"
                     className="toggle border-gray-300"
                     checked={onlyMyStrategies}
                     onChange={() => setOnlyMyStrategies(!onlyMyStrategies)}
              />
              <span className={"ml-2"}>My strategies</span>
            </div>
            <div className={"flex"}>
              <input type="checkbox"
                     className="toggle border-gray-300"
                     checked={onlyAvailable}
                     onChange={() => setOnlyAvailable(!onlyAvailable)}
              />
              <span className={"ml-2"}>Only available</span>
            </div>
          </div>

          <div>
            <input type="text"
                   placeholder="Search"
                   className="input w-full max-w-xs border-gray-300 text-sm rounded-full"
            />
          </div>
        </div>


        <div className={"mt-2 flex w-full justify-between flex-nowrap px-8 py-4 text-sm font-semibold"}>
          <div className={"w-8"}></div>
          <div className={"w-1/6 min-w-32"}>Name</div>
          <div className={"w-24 text-right"}>From</div>
          <div className={"w-8"}></div>
          <div className={"w-24"}>To Asset</div>
          <div className={"w-1/6 min-w-32"}>Total Queue</div>
          <div className={"w-28"}>Status</div>
          <div className={"w-1/5"}>My Position</div>
          <div className={"w-32 text-right"}></div>
        </div>

        <div className={"mb-24"}>
          {allStrategies?.map((strategy, index) => (
            <Link href={`/strategies/${strategy.id}`} key={index}
                  className={"block rounded-lg bg-white px-8 py-3 shadow-sm mb-2 border border-white hover:border-orange-200 hover:text-orange-600 transition"}>
              <div className={"flex w-full justify-between flex-nowrap leading-10"}>
                <div className={"w-8 opacity-70"}>
                  <span className={"text-sm"}>#{index + 1}</span>
                </div>
                <div className={"w-1/6 min-w-32 font-semibold"}>{strategy.title}</div>
                <div className={"w-24 text-right"}>{strategy.assetFromTitle}</div>
                <div className={"w-8 text-center"}>&raquo;</div>
                <div className={"w-24"}>{strategy.assetToTitle}</div>
                <div className={"w-1/6 min-w-32"}>{strategy.totalBalance?.toString()} {strategy.assetFromTitle}</div>
                <div className={"w-28"}>available</div>
                <div className={"w-1/5 text-sm"}>
                  <p>10 {strategy.assetFromTitle} in queue</p>
                  <p>100 {strategy.assetToTitle} available</p>
                </div>
                <div className={"w-32 text-right leading-3"}>

                  <button className={"btn btn-sm border-white hover:bg-orange-300 hover:border-orange-400"} onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    document.getElementById('join_strategy_modal')?.showModal();
                  }}>Join
                  </button>

                  {/*<div className="dropdown dropdown-hover dropdown-end">*/}
                  {/*  <div tabIndex="0" role="button" className="btn btn-sm p-3">*/}
                  {/*    <EllipsisVerticalIcon width={16} height={16} />*/}
                  {/*  </div>*/}
                  {/*  <ul className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">*/}
                  {/*    <li><a>Item 1</a></li>*/}
                  {/*    <li><a>Item 2</a></li>*/}
                  {/*  </ul>*/}
                  {/*</div>*/}
                </div>
              </div>

            </Link>
          ))}
        </div>

      </div>

      <JoinStrategy id={1} />
    </>
  );
};

export default Strategies;
