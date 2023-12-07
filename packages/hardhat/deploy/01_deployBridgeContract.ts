import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { network } from "hardhat";

/**
 * Deploys a contract named "YourContract" using the deployer account and
 * constructor arguments set to the deployer address
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployBridge: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
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

  const flexDCAContract = await hre.ethers.getContract("FlexDCA", deployer);

  const chainLinkRouterCCIP: Record<string, string> = {
    sepolia: "0xd0daae2231e9cb96b94c8512223533293c3693bf",
    polygonMumbai: "0x70499c328e1e2a3c41108bd3730f6670a44595d1",
    polygon: "0x3C3D92629A02a8D95D5CB9650fe49C3544f69B43",
    polygonZkEvm: "0x0000000000000000000000000000000000000000",
    avalanche: "0x27F39D0af3303703750D4001fCc1844c6491563c",
  }

  const chainLinkChainSelector: Record<string, string> = {
    sepolia: "16015286601757825753",
    polygonMumbai: "12532609583862916517",
    polygon: "4051577828743386545",
    polygonZkEvm: "0",
    avalanche: "6433500567565415381",
  }

  const isTestnet: Record<string, boolean> = {
    sepolia: true,
    polygonMumbai: true,
    polygon: false,
    polygonZkEvm: false,
    avalanche: false,
  }

  await deploy("Bridge", {
    from: deployer,
    args: [
      flexDCAContract.address,
      chainLinkRouterCCIP[network.name],
      chainLinkChainSelector[network.name],
      isTestnet[network.name]
    ],
    log: true,
    // autoMine: can be passed to the deploy function to make the deployment process faster on local networks by
    // automatically mining the contract deployment transaction. There is no effect on live networks.
    autoMine: true,
  });
};

export default deployBridge;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags YourContract
deployBridge.tags = ["Bridge"];
