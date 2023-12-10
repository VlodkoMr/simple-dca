import type { NextPage } from "next";
import { MetaHeader } from "~~/components/MetaHeader";
import React from "react";
import Link from "next/link";

const Whitepaper: NextPage = () => {

  return (
    <>
      <MetaHeader />

      <div className={"container "}>
        <h2 className={"text-center mt-6 mb-4"}>FlexDCA Whitepaper</h2>

        <div className={"max-w-3xl mx-auto"}>
          <h4 className={"mt-10"}>What is DCA investment strategy</h4>
          <p className={"mt-3"}>Dollar-Cost Averaging (DCA) is an investment strategy where you invest a fixed amount of money at regular
            intervals, regardless
            of the assets price. This approach helps to reduce the impact of market volatility by buying more shares when prices are low
            and fewer when prices are high. DCA eliminates the need to time the market, reduces emotional decision-making, and is suitable
            for long-term investors. It involves automatic and consistent investments, aiming to achieve a more balanced average cost over
            time.
          </p>
          <h4 className={"mt-10"}>What is FlexDCA platform</h4>
          <p className={"mt-3"}>
            FlexDCA is your gateway to automated crypto investments through the renowned DCA strategy, we allows you to set up investment
            intervals for different crypto (strategies), ensuring a consistent and disciplined investment approach. Simplifying
            the diversification of your crypto portfolio, FlexDCA offers a user-friendly platform that aligns with both simplicity and
            security. Explore a variety of DCA strategies tailored to your preferences, ensuring a seamless and strategic investment
            experience.
          </p>

          <h4 className={"mt-10"}>How It Works, Our Features</h4>
          <p className={"mt-3"}>
            Embark on your crypto investment journey with FlexDCA by connecting your Metamask wallet to our web interface.
            Choose from our range of supported chains, including Polygon, Polygon zkEVM, and Avalanche, offering you the flexibility to
            align with your preferences.
          </p>
          <p className={"mt-3"}>
            Select one or multiple strategies, each strategy involves two tokens: a stablecoin (user deposit) and a crypto token (target of
            the DCA strategy). Users deposit their stablecoin, decide how to split the tokens for individual investments, and set the time
            interval between this investments.
          </p>

          <p className={"mt-3"}>
            <b>Chainlink Automation</b> service with custom logic, monitors all positions through multiple upkeeps and executes swaps based
            on user settings. Combining multiple swaps into a single strategy not only improves efficiency and reduces gas costs but also
            enables the support of a large number of users. These swaps occur on <b>Uniswap</b> or <b>Balancer</b>, using <b>Chainlink Data
            Feeds</b> to check result amount and prevent slippage and negative price impact. If the received amount is less than expected,
            the swap transaction will be reverted.
          </p>

          <p className={"mt-3"}>
            Each strategy in FlexDCA can be individually customized, allowing users to define unique settings, add additional stablecoins,
            claim received crypto, bridge unused stablecoins across multiple chains and strategies, and exit from the strategy to get all
            tokens and cancel swaps.
          </p>

          <p className={"mt-3"}>
            FlexDCA empowers you to adapt to changing portfolio conditions by allowing strategy updates. Move unused stablecoins between
            supported chains effortlessly using <b>Chainlink CCIP</b>, ensuring secure and efficient token transfers.
          </p>
          <p className={"mt-3"}>Connect, strategize, and invest with confidence. FlexDCA puts the power of automated crypto investments in
            your hands, providing a seamless and secure environment to strategically grow your portfolio.
          </p>

          <h4 className={"mt-10"}>Main Features</h4>
          <ul className={"mt-3"}>
            <li>
              Reduces Market Timing Risks: DCA eliminates the need to predict market highs and lows. Investors often find it challenging to
              time the market accurately, and mistimed investments can result in significant losses. DCA avoids the stress of trying to
              enter the market at the perfect time.
            </li>
            <li>
              Mitigates Emotional Decision-Making: By sticking to a consistent investment plan, DCA helps investors avoid making emotional
              decisions based on short-term market fluctuations. Emotions such as fear and greed can lead to impulsive actions, which may
              not be in the best interest of long-term investment goals.
            </li>
            <li>
              Long-Term Focus: DCA is particularly suitable for long-term investors who are more concerned with the overall performance of
              their investments over an extended period rather than short-term market movements.
            </li>
            <li>
              Automatic Investing: Many investors choose to set up automatic transfers from their bank accounts to their investment
              accounts, making the DCA process automatic and convenient.
            </li>
          </ul>

          <h4 className={"mt-10"}>Technologies</h4>
          <p className={"mt-3 mb-16"}>
            Fueling FlexDCA capabilities is a dynamic fusion of innovative technologies. The platform integrates the strengths of
            Chainlink for automated strategy execution, data reliability, and decentralized computations. Balancer optimizes liquidity, and
            Uniswap provides a decentralized and efficient trading environment. With features like Chainlink Automation, Chainlink Data
            Feed, and Chainlink CCIP, FlexDCA ensures a robust and versatile investment ecosystem.
            <br />
            <br />
            <Link href={"/"} className={"text-orange-400 underline"}>&laquo; Homepage</Link>
          </p>

        </div>
      </div>
    </>
  );
};

export default Whitepaper;
