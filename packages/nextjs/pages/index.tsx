import React from "react";
import Image from "next/image";
import Link from "next/link";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { MetaHeader } from "~~/components/MetaHeader";
import { RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
import { BottomBanner } from "~~/components/BottomBanner";

const Home: NextPage = () => {
  const { address } = useAccount();

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

      <section className="section key-feature relative">
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
              <h2>The Highlighting Part Of Our Solution</h2>
            </div>
            <div className="mt-6 lg:col-5 lg:mt-0">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi egestas Werat viverra id et aliquet.
                vulputate egestas sollicitudin .
              </p>
            </div>
          </div>
          <div className="key-feature-grid mt-10 grid grid-cols-2 gap-7 md:grid-cols-3 xl:grid-cols-4">
            <div className="flex flex-col justify-between rounded-lg bg-white p-5 shadow-lg">
              <div>
                <h3 className="h4 text-xl lg:text-2xl">Live Caption</h3>
                <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit.</p>
              </div>
              <span className="icon mt-4">
                <img className="objec-contain" src="/images/icons/feature-icon-1.svg" alt="" />
              </span>
            </div>
            <div className="flex flex-col justify-between rounded-lg bg-white p-5 shadow-lg">
              <div>
                <h3 className="h4 text-xl lg:text-2xl">Smart Reply</h3>
                <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit.</p>
              </div>
              <span className="icon mt-4">
                <img className="objec-contain" src="/images/icons/feature-icon-2.svg" alt="" />
              </span>
            </div>
            <div className="flex flex-col justify-between rounded-lg bg-white p-5 shadow-lg">
              <div>
                <h3 className="h4 text-xl lg:text-2xl">Sound Amplifier</h3>
                <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit.</p>
              </div>
              <span className="icon mt-4">
                <img className="objec-contain" src="/images/icons/feature-icon-3.svg" alt="" />
              </span>
            </div>
            <div className="flex flex-col justify-between rounded-lg bg-white p-5 shadow-lg">
              <div>
                <h3 className="h4 text-xl lg:text-2xl">Gesture Navigation</h3>
                <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit.</p>
              </div>
              <span className="icon mt-4">
                <img className="objec-contain" src="/images/icons/feature-icon-4.svg" alt="" />
              </span>
            </div>
            <div className="flex flex-col justify-between rounded-lg bg-white p-5 shadow-lg">
              <div>
                <h3 className="h4 text-xl lg:text-2xl">Dark Theme</h3>
                <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit.</p>
              </div>
              <span className="icon mt-4">
                <img className="objec-contain" src="/images/icons/feature-icon-5.svg" alt="" />
              </span>
            </div>
            <div className="flex flex-col justify-between rounded-lg bg-white p-5 shadow-lg">
              <div>
                <h3 className="h4 text-xl lg:text-2xl">Privacy Controls</h3>
                <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit.</p>
              </div>
              <span className="icon mt-4">
                <img className="objec-contain" src="/images/icons/feature-icon-6.svg" alt="" />
              </span>
            </div>
            <div className="flex flex-col justify-between rounded-lg bg-white p-5 shadow-lg">
              <div>
                <h3 className="h4 text-xl lg:text-2xl">Location Controls</h3>
                <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit.</p>
              </div>
              <span className="icon mt-4">
                <img className="objec-contain" src="/images/icons/feature-icon-7.svg" alt="" />
              </span>
            </div>
            <div className="flex flex-col justify-between rounded-lg bg-white p-5 shadow-lg">
              <div>
                <h3 className="h4 text-xl lg:text-2xl">Security Updates</h3>
                <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit.</p>
              </div>
              <span className="icon mt-4">
                <img className="objec-contain" src="/images/icons/feature-icon-8.svg" alt="" />
              </span>
            </div>
            <div className="flex flex-col justify-between rounded-lg bg-white p-5 shadow-lg">
              <div>
                <h3 className="h4 text-xl lg:text-2xl">Focus Mode</h3>
                <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit.</p>
              </div>
              <span className="icon mt-4">
                <img className="objec-contain" src="/images/icons/feature-icon-9.svg" alt="" />
              </span>
            </div>
            <div className="flex flex-col justify-between rounded-lg bg-white p-5 shadow-lg">
              <div>
                <h3 className="h4 text-xl lg:text-2xl">Family Link</h3>
                <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit.</p>
              </div>
              <span className="icon mt-4">
                <img className="objec-contain" src="/images/icons/feature-icon-10.svg" alt="" />
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="section services">
        <div className="container">
          <div className="tab row gx-5 items-center" data-tab-group="integration-tab">
            <div className="lg:col-7 lg:order-2">
              <div className="tab-content" data-tab-content>
                <div className="tab-content-panel active" data-tab-panel="0">
                  <img className="w-full object-contain" src="/images/sells-by-country.png" />
                </div>
                <div className="tab-content-panel" data-tab-panel="1">
                  <img className="w-full object-contain" src="/images/collaboration.png" />
                </div>
                <div className="tab-content-panel" data-tab-panel="2">
                  <img className="w-full object-contain" src="/images/sells-by-country.png" />
                </div>
              </div>
            </div>
            <div className="mt-6 lg:col-5 lg:order-1 lg:mt-0">
              <div className="text-container">
                <h2 className="lg:text-4xl">Prevent failure from to impacting your reputation</h2>
                <p className="mt-4">
                  Our platform helps you build secure onboarding authentication experiences that retain and engage your
                  users. We build the infrastructure, you can.
                </p>
                <ul className="tab-nav -ml-4 mt-8 border-b-0" data-tab-nav>
                  <li className="tab-nav-item active" data-tab="0">
                    <img className="mr-3" src="/images/icons/drop.svg" alt="" />
                    Habit building essential choose habit
                  </li>
                  <li className="tab-nav-item" data-tab="1">
                    <img className="mr-3" src="/images/icons/brain.svg" alt="" />
                    Get an overview of Habit Calendars.
                  </li>
                  <li className="tab-nav-item" data-tab="2">
                    <img className="mr-3" src="/images/icons/timer.svg" alt="" />
                    Start building with Habitify platform
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="row gx-5 mt-12 items-center lg:mt-0">
            <div className="lg:col-7">
              <div className="relative">
                <img className="w-full object-contain" src="/images/collaboration.png" />
                <img className="absolute bottom-6 left-1/2 -z-[1] -translate-x-1/2" src="/images/shape.svg" alt="" />
              </div>
            </div>
            <div className="mt-6 lg:col-5 lg:mt-0">
              <div className="text-container">
                <h2 className="lg:text-4xl">Accept payments any country in this whole universe</h2>
                <p className="mt-4">
                  Donec sollicitudin molestie malesda. Donec sollitudin molestie malesuada. Mauris pellentesque nec,
                  egestas non nisi. Cras ultricies ligula sed
                </p>
                <ul className="mt-6 text-dark lg:-ml-4">
                  <li className="mb-2 flex items-center rounded px-4">
                    <img className="mr-3" src="/images/icons/checkmark-circle.svg" alt="" />
                    Supporting more than 119 country world
                  </li>
                  <li className="mb-2 flex items-center rounded px-4">
                    <img className="mr-3" src="/images/icons/checkmark-circle.svg" alt="" />
                    Open transaction with more than currencies
                  </li>
                  <li className="flex items-center rounded px-4">
                    <img className="mr-3" src="/images/icons/checkmark-circle.svg" alt="" />
                    Customer Service with 79 languages
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="row gx-5 mt-12 items-center lg:mt-0">
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
                <h2 className="lg:text-4xl">Accountability that works for you</h2>
                <p className="mt-4">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi egestas Werat viverra id et aliquet.
                  vulputate egestas sollicitudin .
                </p>
                <button className="btn btn-white mt-6">know about us</button>
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
              <p className="mt-6 lg:max-w-[404px]">
                Vestibulum ante ipsum primis in faucibus orci luctus ultrices posuere
                cubilia Curae Donec
              </p>
            </div>
            <div className="mt-8 lg:col-8 lg:mt-0">
              <div className="rounded-xl bg-white px-5 py-5 shadow-lg lg:px-10 lg:py-8">
                <div className="accordion active border-b border-border">
                  <div
                    className="accordion-header relative pl-6 text-lg font-semibold text-dark"
                    data-accordion
                  >
                    How can I integrate Avocode to my current tool stack?
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
                  <div className="accordion-content pl-6">
                    <p>
                      The Service is provided for free during this pilot project, and
                      is provided "as is" with is not committed to any level of
                      service or availability of the Service.
                    </p>
                    <p>
                      If you enter into this agreement on behalf of a company, you
                      hereby agree that the company is responsible under this
                      Agreement for all actions and
                    </p>
                  </div>
                </div>
                <div className="accordion border-b border-border">
                  <div
                    className="accordion-header relative pl-6 text-lg font-semibold text-dark"
                    data-accordion
                  >
                    How can I use Avocode with cloud documents?
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
                  <div className="accordion-content pl-6">
                    <p>
                      The Service is provided for free during this pilot project, and
                      is provided "as is" with is not committed to any level of
                      service or availability of the Service.
                    </p>
                    <p>
                      If you enter into this agreement on behalf of a company, you
                      hereby agree that the company is responsible under this
                      Agreement for all actions and
                    </p>
                  </div>
                </div>
                <div className="accordion border-b border-border">
                  <div
                    className="accordion-header relative pl-6 text-lg font-semibold text-dark"
                    data-accordion
                  >
                    If I cancel, can I archive my designs to keep them safe come back?
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
                  <div className="accordion-content pl-6">
                    <p>
                      The Service is provided for free during this pilot project, and
                      is provided "as is" with is not committed to any level of
                      service or availability of the Service.
                    </p>
                    <p>
                      If you enter into this agreement on behalf of a company, you
                      hereby agree that the company is responsible under this
                      Agreement for all actions and
                    </p>
                  </div>
                </div>
                <div className="accordion">
                  <div
                    className="accordion-header relative pl-6 text-lg font-semibold text-dark"
                    data-accordion
                  >
                    How can I adjust user permissions & admin provileges?
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
                  <div className="accordion-content pl-6">
                    <p>
                      The Service is provided for free during this pilot project, and
                      is provided "as is" with is not committed to any level of
                      service or availability of the Service.
                    </p>
                    <p>
                      If you enter into this agreement on behalf of a company, you
                      hereby agree that the company is responsible under this
                      Agreement for all actions and
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
