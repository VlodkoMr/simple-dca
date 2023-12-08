/**
 * DON'T MODIFY OR DELETE THIS SCRIPT (unless you know what you're doing)
 *
 * This script generates the file containing the contracts Abi definitions.
 * These definitions are used to derive the types needed in the custom scaffold-eth hooks, for example.
 * This script should run as the last deploy script.
 *  */

import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { network } from "hardhat";

/**
 * Generates the TypeScript contract definition file based on the json output of the contract deployment scripts
 * This script should be run last.
 */
const dataSeed: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const [owner] = await hre.ethers.getSigners();

  const flexDCAContract = await hre.ethers.getContract("FlexDCA", owner);
  const bridgeContract = await hre.ethers.getContract("Bridge", owner);


  const pools: Record<string, any> = {
    sepolia: [
      {
        title: "Ethereum",
        fromToken: "DAI",
        toToken: "WETH",
        from: "0x68194a729c2450ad26072b3d33adacbcef39d574",
        to: "0x7b79995e5f793a07bc00c21412e50ecae098e7f9",
        balancerPool: "0xe37b3fe430713ce615caa526d97b7c9e14b93c1a000200000000000000000016",
        dataFeed: "0x0000000000000000000000000000000000000000",
        bridge: true,
      },
      {
        title: "Chainlink",
        fromToken: "DAI",
        toToken: "LINK",
        from: "0x68194a729c2450ad26072b3d33adacbcef39d574",
        to: "0x779877A7B0D9E8603169DdbD7836e478b4624789",
        balancerPool: "0x0000000000000000000000000000000000000000000000000000000000000000",
        dataFeed: "0x0000000000000000000000000000000000000000",
        bridge: true,
      },
      {
        title: "Uniswap",
        fromToken: "USDC",
        toToken: "UNI",
        from: "0x6f14c02fc1f78322cfd7d707ab90f18bad3b54f5",
        to: "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984",
        balancerPool: "0x0000000000000000000000000000000000000000000000000000000000000000",
        dataFeed: "0x0000000000000000000000000000000000000000",
        bridge: true,
      },
    ],
    polygonMumbai: [
      {
        title: "Ethereum",
        fromToken: "USDC",
        toToken: "WETH",
        from: "0x0FA8781a83E46826621b3BC094Ea2A0212e71B23",
        to: "0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa",
        balancerPool: "0x0000000000000000000000000000000000000000000000000000000000000000",
        dataFeed: "0x0000000000000000000000000000000000000000",
        bridge: true,
      },
      {
        title: "Matic",
        fromToken: "USDC",
        toToken: "WMATIC",
        from: "0x0FA8781a83E46826621b3BC094Ea2A0212e71B23",
        to: "0x9c3c9283d3e44854697cd22d3faa240cfb032889",
        balancerPool: "0x0000000000000000000000000000000000000000000000000000000000000000",
        dataFeed: "0x0000000000000000000000000000000000000000",
        bridge: true,
      },
      {
        title: "Chainlink",
        fromToken: "USDC",
        toToken: "LINK",
        from: "0x0FA8781a83E46826621b3BC094Ea2A0212e71B23",
        to: "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
        balancerPool: "0x0000000000000000000000000000000000000000000000000000000000000000",
        dataFeed: "0x0000000000000000000000000000000000000000",
        bridge: true,
      },
    ],
    polygon: [
      {
        title: "Bitcoin",
        fromToken: "USDC.e",
        toToken: "WBTC",
        from: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
        to: "0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6",
        balancerPool: "0x03cd191f589d12b0582a99808cf19851e468e6b500010000000000000000000a",
        dataFeed: "0xF4030086522a5bEEa4988F8cA5B36dbC97BeE88c",
        bridge: true,
      },
      {
        title: "Ethereum",
        fromToken: "USDC.e",
        toToken: "WETH",
        from: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
        to: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
        balancerPool: "0x03cd191f589d12b0582a99808cf19851e468e6b500010000000000000000000a",
        dataFeed: "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419",
        bridge: true,
      },
      {
        title: "Matic",
        fromToken: "USDC.e",
        toToken: "WMATIC",
        from: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
        to: "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270",
        balancerPool: "0x0297e37f1873d2dab4487aa67cd56b58e2f27875000100000000000000000002",
        dataFeed: "0x7bAC85A8a13A4BcD8abb3eB7d6b4d632c5a57676",
        bridge: true,
      },
      {
        title: "Balancer",
        fromToken: "USDC.e",
        toToken: "BAL",
        from: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
        to: "0x9a71012b13ca4d3d0cdc72a177df3ef03b0e76a3",
        balancerPool: "0x0297e37f1873d2dab4487aa67cd56b58e2f27875000100000000000000000002",
        dataFeed: "0xC1438AA3823A6Ba0C159CfA8D98dF5A994bA120b",
        bridge: true,
      },
      {
        title: "Shiba Inu",
        fromToken: "USDT",
        toToken: "SHIB",
        from: "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
        to: "0x6f8a06447ff6fcf75d803135a7de15ce88c1d4ec",
        balancerPool: "0x0000000000000000000000000000000000000000000000000000000000000000",
        dataFeed: "0x0000000000000000000000000000000000000000",
        bridge: false,
      },
    ],
    polygonZkEvm: [
      {
        title: "Ethereum",
        fromToken: "USDC",
        toToken: "WETH",
        from: "0xa8ce8aee21bc2a48a5ef670afcc9274c7bbbc035",
        to: "0x4F9A0e7FD2Bf6067db6994CF12E4495Df938E6e9",
        balancerPool: "0xc951aebfa361e9d0063355b9e68f5fa4599aa3d1000100000000000000000017",
        dataFeed: "0x0000000000000000000000000000000000000000",
        bridge: true,
      },
      {
        title: "Matic",
        fromToken: "USDC",
        toToken: "MATIC",
        from: "0xa8ce8aee21bc2a48a5ef670afcc9274c7bbbc035",
        to: "0xa2036f0538221a77a3937f1379699f44945018d0",
        balancerPool: "0xc951aebfa361e9d0063355b9e68f5fa4599aa3d1000100000000000000000017",
        dataFeed: "0x0000000000000000000000000000000000000000",
        bridge: true,
      },
      {
        title: "Balancer",
        fromToken: "USDC",
        toToken: "BAL",
        from: "0xa8ce8aee21bc2a48a5ef670afcc9274c7bbbc035",
        to: "0x120ef59b80774f02211563834d8e3b72cb1649d6",
        balancerPool: "0x195def5dabc4a73c4a6a410554f4e53f3e55f1a900010000000000000000000a",
        dataFeed: "0x0000000000000000000000000000000000000000",
        bridge: true,
      },
      {
        title: "Balancer",
        fromToken: "USDT",
        toToken: "BAL",
        from: "0x1e4a5963abfd975d8c9021ce480b42188849d41d",
        to: "0x120ef59b80774f02211563834d8e3b72cb1649d6",
        balancerPool: "0x195def5dabc4a73c4a6a410554f4e53f3e55f1a900010000000000000000000a",
        dataFeed: "0x0000000000000000000000000000000000000000",
        bridge: true,
      },
    ],
    avalanche: [
      {
        title: "Bitcoin",
        fromToken: "USDC",
        toToken: "BTC.b",
        from: "0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e",
        to: "0x152b9d0fdc40c096757f570a51e494bd4b943e50",
        balancerPool: "0xab567c27450e3fa1b4ee4e67ca7d1003c49e7ea800020000000000000000002b",
        dataFeed: "0x2779D32d5166BAaa2B2b658333bA7e6Ec0C65743",
        bridge: true,
      },
      {
        title: "Bitcoin",
        fromToken: "USDT",
        toToken: "BTC.b",
        from: "0x9702230a8ea53601f5cd2dc00fdbc13d4df4a8c7",
        to: "0x152b9d0fdc40c096757f570a51e494bd4b943e50",
        balancerPool: "0x96518f83d66bdc6a5812f01c54f8e022f6796399000200000000000000000020",
        dataFeed: "0x2779D32d5166BAaa2B2b658333bA7e6Ec0C65743",
        bridge: true,
      },
      {
        title: "Ethereum",
        fromToken: "USDT",
        toToken: "WETH.e",
        from: "0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7",
        to: "0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB",
        balancerPool: "0x0000000000000000000000000000000000000000000000000000000000000000",
        dataFeed: "0x976B3D034E162d8bD72D6b9C989d545b839003b0",
        bridge: true,
      },
      {
        title: "Chainlink",
        fromToken: "USDT",
        toToken: "LINK",
        from: "0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7",
        to: "0x5947bb275c521040051d82396192181b413227a3",
        balancerPool: "0x0000000000000000000000000000000000000000000000000000000000000000",
        dataFeed: "0x49ccd9ca821EfEab2b98c60dC60F518E765EDe9a",
        bridge: true,
      },
      {
        title: "Frax Share",
        fromToken: "USDT",
        toToken: "FXS",
        from: "0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7",
        to: "0xD67de0e0a0Fd7b15dC8348Bb9BE742F3c5850454",
        balancerPool: "0x0000000000000000000000000000000000000000000000000000000000000000",
        dataFeed: "0x12Af94c3716bbf339Aa26BfD927DDdE63B27D50C",
        bridge: true,
      },
      {
        title: "GMX",
        fromToken: "USDT",
        toToken: "GMX",
        from: "0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7",
        to: "0x62edc0692BD897D2295872a9FFCac5425011c661",
        balancerPool: "0x0000000000000000000000000000000000000000000000000000000000000000",
        dataFeed: "0x3F968A21647d7ca81Fb8A5b69c0A452701d5DCe8",
        bridge: true,
      },
    ],
  };

  // set bridgeContract address
  // await flexDCAContract.setBridgeAddress(bridgeContract.address);

  // add strategies
  const usersInStrategy = 1000;
  if (pools[network.name]) {
    for (const pool of pools[network.name]) {
      await flexDCAContract.newStrategy(
        pool.title,
        pool.fromToken,
        pool.toToken,
        pool.from,
        pool.to,
        pool.balancerPool,
        pool.dataFeed,
        pool.bridge,
        usersInStrategy
      );
      console.log(`> ${pool.title} strategy added`);
    }
  } else {
    console.log(`No pools found for ${network.name}`);
  }
};

export default dataSeed;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags generateTsAbis
dataSeed.tags = ["dataSeed"];

dataSeed.runAtTheEnd = true;
