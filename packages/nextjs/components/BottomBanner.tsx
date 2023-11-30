import React from "react";
import Link from "next/link";

/**
 * Site footer
 */
export const BottomBanner = () => {
  return (
    <section className="px-5 xl:pt-[20px] xl:pb-[80px]">
      <div className="container">
        <div className="bg-gradient row justify-center rounded-b-[80px] rounded-t-[20px] px-[20px] pb-[75px] pt-16">
          <div className="lg:col-11">
            <div className="row">
              <div className="lg:col-4">
                <h2 className="h2 text-white">
                  Smart investing made simple
                </h2>
                <Link className="btn btn-white mt-8" href="#">
                  Whitepaper
                </Link>
              </div>
              <div className="mt-8 lg:col-8 lg:mt-0 pl-6">
                <p className="text-white mt-1">
                  Experience the ease of Dollar Cost Averaging (DCA) strategy on FlexDCA, where simplicity meets security and
                  decentralisation.

                </p>
                <p className="text-white mt-4">
                  Our platform guarantees the consistent management of your investments, coupled with cutting-edge blockchain features,
                  ensuring a seamless experience. Your investments are fortified with robust security measures, providing a safeguarded
                  environment. Moreover, relish the flexibility to bridge assets between chains, effortlessly enhancing your portfolio
                  diversification.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
