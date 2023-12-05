import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { network } from "hardhat";

/**
 * Deploys a contract named "YourContract" using the deployer account and
 * constructor arguments set to the deployer address
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployFlexDCA: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  /*
    On localhost, the deployer account is the one that comes with Hardhat, which is already funded.

    When deploying to live networks (e.g `yarn deploy --network goerli`), the deployer account
    should have sufficient balance to pay for the gas fees for contract creation.

    You can generate a random account with `yarn generate` which will fill DEPLOYER_PRIVATE_KEY
    with a random private key in the .env file (then used on hardhat.config.ts)
    You can run the `yarn account` command to check your balance in every network.
  */
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  const feeCollector = deployer;
  const balancerVaultAddress = "0xBA12222222228d8Ba445958a75a0704d566BF2C8";
  const uniswapSwapRouter: Record<string, string> = {
    sepolia: "0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD",
    goerli: "0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD",
    polygon: "0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD",
    polygonZkEvm: "",
    avalanche: "0x82635AF6146972cD6601161c4472ffe97237D292",
  }

  await deploy("FlexDCA", {
    from: deployer,
    args: [deployer, balancerVaultAddress, uniswapSwapRouter[network.name], feeCollector],
    log: true,
    // autoMine: can be passed to the deploy function to make the deployment process faster on local networks by
    // automatically mining the contract deployment transaction. There is no effect on live networks.
    autoMine: true,
  });
};

export default deployFlexDCA;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags YourContract
deployFlexDCA.tags = ["FlexDCA"];
