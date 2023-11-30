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

  const pools: Record<string, any> = {
    goerli: [
      {
        title: "USDC/ETH",
        from: "0xe0C9275E44Ea80eF17579d33c55136b7DA269aEb",
        to: "0x0000000000000000000000000000000000000000",
        pool: "0x9ee0af1ee0a0782daf5f1af47fd49b2a766bd8d40001000000000000000004b9",
      },
      {
        title: "USDC/WBTC",
        from: "0xe0C9275E44Ea80eF17579d33c55136b7DA269aEb",
        to: "0x37f03a12241e9fd3658ad6777d289c3fb8512bc9",
        pool: "0x67f8fcb9d3c463da05de1392efdbb2a87f8599ea000200000000000000000059",
      },
      {
        title: "USDC/LINK",
        from: "0xe0C9275E44Ea80eF17579d33c55136b7DA269aEb",
        to: "0x326c977e6efc84e512bb9c30f76e30c160ed06fb",
        pool: "0xf712f9abec5dd3cae089e73be5f24ce254128df000010000000000000000061e",
      },
      {
        title: "USDC/EMDX",
        from: "0xe0C9275E44Ea80eF17579d33c55136b7DA269aEb",
        to: "0x8cef8978c097037091edfe129cc77bd2259896e8",
        pool: "0x19cbce9003155892f9fdd518ff7762c51be6b8e3000200000000000000000766",
      },
    ],
    polygon: [
      {
        title: "USDC/",
        from: "",
        to: "",
        pool: "",
      },
      {
        title: "USDC/",
        from: "",
        to: "",
        pool: "",
      },
      {
        title: "USDC/",
        from: "",
        to: "",
        pool: "",
      },
      {
        title: "USDT/",
        from: "",
        to: "",
        pool: "",
      },
    ],
    polygonZkEvm: [
      {
        title: "USDC/ETH",
        from: "0xa8ce8aee21bc2a48a5ef670afcc9274c7bbbc035",
        to: "0x0000000000000000000000000000000000000000",
        pool: "0xc951aebfa361e9d0063355b9e68f5fa4599aa3d1000100000000000000000017",
      },
      {
        title: "USDC/MATIC",
        from: "0xa8ce8aee21bc2a48a5ef670afcc9274c7bbbc035",
        to: "0xa2036f0538221a77a3937f1379699f44945018d0",
        pool: "0xc951aebfa361e9d0063355b9e68f5fa4599aa3d1000100000000000000000017",
      },
      {
        title: "USDC/BAL",
        from: "0xa8ce8aee21bc2a48a5ef670afcc9274c7bbbc035",
        to: "0x120ef59b80774f02211563834d8e3b72cb1649d6",
        pool: "0x195def5dabc4a73c4a6a410554f4e53f3e55f1a900010000000000000000000a",
      },
      {
        title: "USDT/BAL",
        from: "0x1e4a5963abfd975d8c9021ce480b42188849d41d",
        to: "0x120ef59b80774f02211563834d8e3b72cb1649d6",
        pool: "0x195def5dabc4a73c4a6a410554f4e53f3e55f1a900010000000000000000000a",
      },
    ],
    avalanche: [
      {
        title: "USDC/BTC.b",
        from: "0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e",
        to: "0x152b9d0fdc40c096757f570a51e494bd4b943e50",
        pool: "0xab567c27450e3fa1b4ee4e67ca7d1003c49e7ea800020000000000000000002b",
      },
      {
        title: "USDt/BTC.b",
        from: "0x9702230a8ea53601f5cd2dc00fdbc13d4df4a8c7",
        to: "0x152b9d0fdc40c096757f570a51e494bd4b943e50",
        pool: "0x96518f83d66bdc6a5812f01c54f8e022f6796399000200000000000000000020",
      },
      {
        title: "USDt/VCHF",
        from: "0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e",
        to: "0x228a48df6819ccc2eca01e2192ebafffdad56c19",
        pool: "0x0099111ed107bdf0b05162356aee433514aac44000020000000000000000002f",
      },
    ],
  };

  console.log(`network`, network);
  const usersInStrategy = 1000;

  if (pools[network.name]) {
    for (const pool of pools[network.name]) {
      await flexDCAContract.newStrategy(pool.title, pool.from, pool.to, pool.pool, usersInStrategy);
      console.log(`${pool.title} strategy added`);
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
