import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";

export const Header = () => {
  const router = useRouter();

  return (
    <header className={`header sticky`}>
      <nav className="navbar container">
        <div className="order-0">
          <Link href="/">
            <Image src={"/logo.png"} height="40" width="180" alt="logo" />
          </Link>
        </div>

        <input id="nav-toggle" type="checkbox" className="hidden" />
        <label
          id="show-button"
          htmlFor="nav-toggle"
          className="order-1 flex cursor-pointer items-center lg:order-1 lg:hidden"
        >
          <svg className="h-6 fill-current" viewBox="0 0 20 20">
            <title>Menu Open</title>
            <path d="M0 3h20v2H0V3z m0 6h20v2H0V9z m0 6h20v2H0V0z"></path>
          </svg>
        </label>
        <label id="hide-button" htmlFor="nav-toggle" className="order-2 hidden cursor-pointer items-center lg:order-1">
          <svg className="h-6 fill-current" viewBox="0 0 20 20">
            <title>Menu Close</title>
            <polygon
              points="11 9 22 9 22 11 11 11 11 22 9 22 9 11 -2 11 -2 9 9 9 9 -2 11 -2"
              transform="rotate(45 10 10)"
            ></polygon>
          </svg>
        </label>

        <ul
          id="nav-menu"
          className="navbar-nav mr-4 order-2 hidden w-full flex-[0_0_100%] lg:order-1 lg:flex lg:w-auto lg:flex-auto lg:justify-center lg:space-x-5"
        >
          <li className="nav-item">
            <Link href={"/"} className={`nav-link ${router.pathname == "/" ? "active" : ""}`}>
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link
              href={"/strategies"}
              className={`nav-link ${
                router.pathname == "/strategies" || router.pathname == "/strategies/[id]" ? "active" : ""
              }`}
            >
              Strategies
            </Link>
          </li>
          <li className="nav-item">
            <Link href={"/bridge"} className={`nav-link ${router.pathname == "/bridge" ? "active" : ""}`}>
              Bridge
            </Link>
          </li>
          {/*<li className="nav-item">*/}
          {/*  <Link href={"/fDCA"} className={`nav-link ${router.pathname == "/fDCA" ? "active" : ""}`}>*/}
          {/*    fDCA*/}
          {/*  </Link>*/}
          {/*</li>*/}
          <li className="nav-item">
            <Link href={"/statistic"} className={`nav-link ${router.pathname == "/statistic" ? "active" : ""}`}>
              Statistic
            </Link>
          </li>
          <li className="nav-item">
            <Link href={"/whitepaper"} className={`nav-link ${router.pathname == "/whitepaper" ? "active" : ""}`}>
              Whitepaper
            </Link>
          </li>
          <li className="nav-item mt-3.5 lg:hidden rainbow-btn">
            <RainbowKitCustomConnectButton />
          </li>
        </ul>
        <div className="order-1 ml-auto hidden items-center md:order-2 md:ml-0 lg:flex rainbow-btn -mt-2.5">
          <RainbowKitCustomConnectButton />
        </div>
      </nav>
    </header>
  );
};
