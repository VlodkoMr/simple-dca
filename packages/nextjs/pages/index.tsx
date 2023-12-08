import React from "react";
import Image from "next/image";
import Link from "next/link";
import type { NextPage } from "next";
import { useAccount, useNetwork } from "wagmi";
import { MetaHeader } from "~~/components/MetaHeader";
import { RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
import { BottomBanner } from "~~/components/BottomBanner";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";
import { getTargetNetwork } from "~~/utils/scaffold-eth";
import { formatUnits } from "viem";
import { useTokensDecimal } from "~~/hooks/useTokensDecimal";

const Home: NextPage = () => {
  const { address } = useAccount();
  const { chain } = useNetwork();

  const { data: allStrategies } = useScaffoldContractRead({
    contractName: "FlexDCA",
    functionName: "getAllStrategies",
    cacheTime: 5_000,
    chainId: chain?.id || getTargetNetwork().id,
  });

  const { tokenDecimals } = useTokensDecimal({ allStrategies });

  console.log(`allStrategies`, allStrategies);

  return (
    <>
      <MetaHeader />

      <section className="section banner relative">
        <div className="container">
          <div className="row items-center">
            <div className="lg:col-6">
              <h1 className="banner-title">Automate Your Crypto Success with FlexDCA</h1>
              <p className="my-6">
                Discover the ease of automated crypto investments with well-known DCA strategy. Effortlessly diversify
                your crypto portfolio and embrace simplicity in every investment.
              </p>

              {address ? (
                <Link href={"/strategies"} className="btn btn-white mt-8">
                  Discover strategies &raquo;
                </Link>
              ) : (
                <RainbowKitCustomConnectButton />
              )}
            </div>
            <div className="lg:col-6">
              <Image
                src={"/images/banner-img.png"}
                className="w-full object-contain"
                width="603"
                height="396"
                alt={""}
              />
            </div>
          </div>
        </div>

        <Image
          className="banner-shape absolute -top-28 right-0 -z-[1] w-full max-w-[30%]"
          src="/images/banner-shape.svg"
          width="603"
          height="396"
          alt=""
        />
      </section>

      <section className="section key-feature relative mb-0 pb-0">
        <Image
          className="absolute left-0 top-0 -z-[1] -translate-y-1/2"
          src="/images/icons/feature-shape.svg"
          alt=""
          width={60}
          height={60}
        />
        <div className="container">
          <div className="row justify-between text-center lg:text-start">
            <div className="lg:col-5">
              <h2>All DCA Strategies</h2>
            </div>
            <div className="mt-6 lg:col-5 lg:mt-0 text-right">
              <p>
                Experience the ease of Dollar Cost Averaging strategy on FlexDCA, where simplicity meets security and
                decentralisation.
              </p>
            </div>
          </div>

          {allStrategies && (
            <div className="mt-10 flex flex-row w-full gap-8">
              {allStrategies.map(strategy => (
                <Link href={`/strategies/${strategy.id}`}
                      key={strategy.id}
                      className="flex flex-auto w-1/3 min-w-64 flex-col justify-between rounded-lg bg-white p-5 shadow-lg border border-white hover:border-orange-300 hover:bg-orange-50">
                  <div className={"flex flex-row justify-between border-b pb-3 mb-4"}>
                    <h3 className="h4 text-xl lg:text-2xl">{strategy.title}</h3>
                    <p className={"pt-1"}>{strategy.assetFromTitle} &raquo; {strategy.assetToTitle}</p>
                  </div>
                  <div>
                    Assets in queue: <b>{
                    parseFloat(formatUnits(strategy.totalBalance, tokenDecimals[strategy.fromAsset])).toFixed(2)
                  } {strategy.assetFromTitle}</b>
                  </div>
                  <div>
                    Total spent: <b>{
                    parseFloat(formatUnits(strategy.totalAmountFromAsset, tokenDecimals[strategy.fromAsset])).toFixed(2)
                  } {strategy.assetFromTitle}</b>
                  </div>
                  <div>
                    Total received: <b>{
                    parseFloat(formatUnits(strategy.totalAmountToAsset, tokenDecimals[strategy.fromAsset])).toFixed(4)
                  } {strategy.assetToTitle}</b>
                  </div>
                </Link>
              ))}
            </div>
          )}

        </div>
      </section>

      <section className="section services mb-0 pb-6">
        <div className="container">
          <div className=" row gx-5 items-center" data-tab-group="integration-tab">
            <div className="lg:col-7 lg:order-2">
              <div className="tab-content">
                <div className="tab-content-panel active" data-tab-panel="0">
                  <img className="w-full object-contain" src="/images/sells-by-country.png" />
                </div>
              </div>
            </div>

            <div className="mt-6 lg:col-5 lg:order-1 lg:mt-0">
              <div className="text-container">
                <h2 className="lg:text-4xl">Prevent failure for your investments</h2>
                <p className="mt-4">
                  Our platform is designed to fortify your financial strategy and protect against unforeseen challenges.
                  With robust risk management features and strategic insights, we empower you to navigate the market confidently, preventing
                  failures and securing the success of your investments.
                </p>
                <div className="tab-nav -ml-4 mt-8 border-b-0">
                  <Link href={"/whitepaper"} className="block flex bg-gray-200 rounded-full py-2 px-6 hover:bg-orange-100">
                    <img className="mr-3" src="/images/icons/arrow-right.svg" alt="" />
                    Read Whitepaper
                  </Link>
                </div>
              </div>
            </div>
          </div>


          <div className="row gx-5 mt-8 items-center lg:mt-0">
            <div className="lg:col-5">
              <div className="relative">
                <img className="w-full object-contain" src="/images/collaboration.png" />
                <img className="absolute bottom-6 left-1/2 -z-[1] -translate-x-1/2" src="/images/shape.svg" alt="" />
              </div>
            </div>
            <div className="mt-6 lg:col-7 lg:mt-0">
              <div className="max-w-lg mx-auto">
                <h2 className="lg:text-4xl">
                  Our Technologies
                </h2>
                <p className="mt-4">
                  Powered by a dynamic fusion of innovative technologies, our platform integrates the prowess of Chainlink, Balancer, and
                  Uniswap. Chainlink enhances data reliability and decentralized computations, Balancer optimizes liquidity, and Uniswap
                  provides a decentralized and efficient trading environment.
                </p>
                <ul className="mt-6 text-dark lg:-ml-4 mb-10">
                  <li className="mb-3 flex items-center rounded px-4 leading-5">
                    <img className="mr-3" src="/images/icons/checkmark-circle.svg" alt="" />
                    <p><b>Chainlink Automation</b> execute your strategy on time, with custom settings.</p>
                  </li>
                  <li className="mb-3 flex items-center rounded px-4 leading-5">
                    <img className="mr-3" src="/images/icons/checkmark-circle.svg" alt="" />
                    <p><b>Chainlink Data Feed</b> enshure your strategy is executed with the right price.</p>
                  </li>
                  <li className="mb-3 flex items-center rounded px-4 leading-5">
                    <img className="mr-3" src="/images/icons/checkmark-circle.svg" alt="" />
                    <p><b>Chainlink CCIP</b> allow to bridge assets between blockchains and diversify your DCA strategy.</p>
                  </li>
                  <li className="flex items-center rounded px-4 leading-5">
                    <img className="mr-3" src="/images/icons/checkmark-circle.svg" alt="" />
                    <p><b>Multichain support</b>: Polygon, Polygon ZkEVM and Avalanche.</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="row gx-5 mt-12 items-center lg:mt-10">
            <div className="lg:col-7 lg:order-2">
              <div className="video pb-5 pr-9">
                <div className="video-thumbnail overflow-hidden rounded-2xl">
                  <img className="w-full object-contain" src="/images/intro-thumbnail.png" alt="" />
                  <button className="video-play-btn">
                    <img src="/images/icons/play-icon.svg" alt="" />
                  </button>
                </div>
                <div className="video-player absolute left-0 top-0 z-10 hidden h-full w-full">...</div>
                <img className="intro-shape absolute bottom-0 right-0 -z-[1]" src="/images/shape.svg" alt="" />
              </div>
            </div>
            <div className="mt-6 lg:col-5 lg:order-1 lg:mt-0">
              <div className="text-container">
                <h2 className="lg:text-4xl">User-Friendly Onboarding</h2>
                <p className="mt-4">
                  Joining the future of finance has never been easier. Our user-friendly onboarding process allows you to connect your
                  Metamask wallet, choose a supported network, and start investing within minutes.
                </p>
                <Link href={"/whitepaper"} className="btn btn-white mt-6">know about us</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="faqs section">
        <div className="container max-w-[1230px]">
          <div className="row">
            <div className="text-center lg:col-4 lg:text-start">
              <h2>Frequently Asked Questions</h2>
              <p className="mt-6 lg:max-w-[404px] pr-8">
                Leat more about FlexDCA and how it can help you to automate your crypto investments.
              </p>
            </div>
            <div className="mt-8 lg:col-8 lg:mt-0">
              <div className="rounded-xl bg-white px-5 py-5 shadow-lg lg:px-10 lg:py-8">
                <div className="collapse active border-b border-border">
                  <input type="radio" name="my-accordion-1" />
                  <div
                    className="accordion-header relative pl-6 collapse-title text-lg font-semibold text-dark"
                  >
                    What is DCA strategy and FlexDCA platform?
                    <svg
                      className="accordion-icon absolute left-0 top-[22px]"
                      x="0px"
                      y="0px"
                      viewBox="0 0 512 512"
                      xmlSpace="preserve"
                    >
                      <path
                        fill="currentColor"
                        d="M505.755,123.592c-8.341-8.341-21.824-8.341-30.165,0L256.005,343.176L36.421,123.592c-8.341-8.341-21.824-8.341-30.165,0 s-8.341,21.824,0,30.165l234.667,234.667c4.16,4.16,9.621,6.251,15.083,6.251c5.462,0,10.923-2.091,15.083-6.251l234.667-234.667 C514.096,145.416,514.096,131.933,505.755,123.592z"
                      ></path>
                    </svg>
                  </div>
                  <div className="collapse-content pl-6">
                    <p className={"mb-4"}>
                      FlexDCA offers a dynamic platform for seamlessly swapping cryptocurrencies into your preferred tokens using Dollar
                      Cost Averaging (DCA) strategies. Our mission is to provide innovative strategies that empower you to diversify and
                      enhance your crypto portfolio.
                    </p>
                    <p>
                      Dollar Cost Averaging (DCA) is a proven investment strategy, involving the consistent purchase of assets at fixed
                      intervals, regardless of their current market price. By acquiring more of an asset when prices are low and less when
                      prices are high, DCA helps mitigate the impact of market volatility. At FlexDCA, we leverage DCA to provide you with a
                      secure and strategic approach to navigating the dynamic cryptocurrency landscape.
                    </p>
                  </div>
                </div>
                <div className="collapse border-b border-border">
                  <input type="radio" name="my-accordion-1" />
                  <div
                    className="accordion-header collapse-title relative pl-6 text-lg font-semibold text-dark"
                  >
                    How can I use FlexDCA?
                    <svg
                      className="accordion-icon absolute left-0 top-[22px]"
                      x="0px"
                      y="0px"
                      viewBox="0 0 512 512"
                      xmlSpace="preserve"
                    >
                      <path
                        fill="currentColor"
                        d="M505.755,123.592c-8.341-8.341-21.824-8.341-30.165,0L256.005,343.176L36.421,123.592c-8.341-8.341-21.824-8.341-30.165,0 s-8.341,21.824,0,30.165l234.667,234.667c4.16,4.16,9.621,6.251,15.083,6.251c5.462,0,10.923-2.091,15.083-6.251l234.667-234.667 C514.096,145.416,514.096,131.933,505.755,123.592z"
                      ></path>
                    </svg>
                  </div>
                  <div className="collapse-content pl-6">
                    <p>
                      Getting started is a breeze! Simply connect your Metamask wallet and switch to one of our supported networks. From
                      there, explore and select a strategy that aligns with your investment goals. It's that easy – you're now ready to
                      kickstart your investment journey with just a few clicks.
                    </p>
                  </div>
                </div>
                <div className="collapse border-b border-border">
                  <input type="radio" name="my-accordion-1" />
                  <div
                    className="accordion-header collapse-title relative pl-6 text-lg font-semibold text-dark"
                  >
                    What platform fees are charged?
                    <svg
                      className="accordion-icon absolute left-0 top-[22px]"
                      x="0px"
                      y="0px"
                      viewBox="0 0 512 512"
                      xmlSpace="preserve"
                    >
                      <path
                        fill="currentColor"
                        d="M505.755,123.592c-8.341-8.341-21.824-8.341-30.165,0L256.005,343.176L36.421,123.592c-8.341-8.341-21.824-8.341-30.165,0 s-8.341,21.824,0,30.165l234.667,234.667c4.16,4.16,9.621,6.251,15.083,6.251c5.462,0,10.923-2.091,15.083-6.251l234.667-234.667 C514.096,145.416,514.096,131.933,505.755,123.592z"
                      ></path>
                    </svg>
                  </div>
                  <div className="collapse-content pl-6">
                    <p>
                      We get 1% fee that applied to the total transaction amount when strategy executes a swap.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <BottomBanner />
    </>
  );
};

export default Home;
