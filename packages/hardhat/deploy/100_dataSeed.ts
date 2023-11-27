/**
 * DON'T MODIFY OR DELETE THIS SCRIPT (unless you know what you're doing)
 *
 * This script generates the file containing the contracts Abi definitions.
 * These definitions are used to derive the types needed in the custom scaffold-eth hooks, for example.
 * This script should run as the last deploy script.
 *  */

import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

/**
 * Generates the TypeScript contract definition file based on the json output of the contract deployment scripts
 * This script should be run last.
 */
const dataSeed: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const [owner] = await hre.ethers.getSigners();

  const simpleDCAContract = await hre.ethers.getContract("SimpleDCA", owner);

  // USDC > ETH
  await simpleDCAContract.newStrategy(
    "0xe0C9275E44Ea80eF17579d33c55136b7DA269aEb",
    "0x0000000000000000000000000000000000000000",
    "0x9ee0af1ee0a0782daf5f1af47fd49b2a766bd8d40001000000000000000004b9",
    1000,
  );

  console.log(`USDC > ETH strategy added`);

  // ETH > USDC
  // const tx = await yourContract.swap({value: hre.ethers.utils.parseEther("0.025")} );

  // USDC > ETH
  // const USDC = "0xe0C9275E44Ea80eF17579d33c55136b7DA269aEb";
  // const ContractUSDC = await hre.ethers.getContractAt(erc20ABI, USDC, owner);
  //
  // const approveTX = await ContractUSDC.approve(yourContract.address, parseUnits("1", 6));
  // await approveTX.wait();
  // console.log(`Approved for ${yourContract.address}: ${parseUnits("1", 6)}`);
  //
  // const depositTX = await yourContract.deposit();
  // await depositTX.wait();
  //
  // const swapTx = await yourContract.swap();
  // await swapTx.wait();
};

export default dataSeed;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags generateTsAbis
dataSeed.tags = ["dataSeed"];

dataSeed.runAtTheEnd = true;
