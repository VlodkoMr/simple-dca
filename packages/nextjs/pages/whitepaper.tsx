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
            of the asset's price. This approach helps to reduce the impact of market volatility by buying more shares when prices are low
            and fewer when prices are high. DCA eliminates the need to time the market, reduces emotional decision-making, and is suitable
            for long-term investors. It involves automatic and consistent investments, aiming to achieve a more balanced average cost over
            time.
          </p>
          <h4 className={"mt-10"}>What is FlexDCA platform</h4>
          <p className={"mt-3"}>
            FlexDCA is your gateway to automated crypto investments through the renowned DCA strategy, we allows you to set up investment
            intervals for different crypto, ensuring a consistent and disciplined investment approach. Simplifying
            the diversification of your crypto portfolio, FlexDCA offers a user-friendly platform that aligns with both simplicity and
            security. Explore a variety of DCA strategies tailored to your preferences, ensuring a seamless and strategic investment
            experience.
          </p>

          <h4 className={"mt-10"}>How It Works, Our Features</h4>
          <p className={"mt-3"}>
            Embark on your crypto investment journey with FlexDCA by effortlessly connecting your Metamask wallet to our user-friendly
            platform. Choose from our range of supported chains, including Ethereum, Matic, and Chainlink, offering you the flexibility to
            align with your preferences.
          </p>
          <p className={"mt-3"}>
            Select one or multiple strategies, defining the crypto tokens you want to acquire, and deposit stablecoins to fund your chosen
            strategies. Take control of your investment approach by setting up Dollar Cost Averaging (DCA) parameters, specifying how much
            and how frequently you wish to invest in crypto.
          </p>
          <p className={"mt-3"}>
            Witness the power of Chainlink Automation in action as it seamlessly executes your transactions, utilizing protocols like
            Balancer or Uniswap to optimize your crypto swaps. Ensure transaction accuracy with Chainlink Data Feed, which verifies that the
            amount received in your wallet corresponds precisely to the market price during the swap.</p>
          <p className={"mt-3"}>
            FlexDCA empowers you to adapt to changing market conditions by allowing strategy updates. Move unused stablecoins between
            supported chains effortlessly using Chainlink CCIP, ensuring secure and efficient token transfers.
          </p>
          <p className={"mt-3"}>Connect, strategize, and invest with confidence. FlexDCA puts the power of automated crypto investments in
            your hands,
            providing a seamless and secure environment to strategically grow your portfolio.
          </p>

          <h4 className={"mt-10"}>Technologies</h4>
          <p className={"mt-3 mb-16"}>
            Fueling FlexDCA's capabilities is a dynamic fusion of innovative technologies. The platform integrates the strengths of
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
