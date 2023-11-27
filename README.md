# Simple DCA

Welcome to SimpleDCA, where seamless crypto swaps meet the well-known Dollar Cost Averaging (DCA) strategy.
Diversify and enhance your portfolio effortlessly with our user-friendly platform.
Simplify crypto investing with precision and strategy, using the tried-and-true DCA approach for optimal results.

## Requirements

Before you begin, you need to install the following tools:

- [Node (v18 LTS)](https://nodejs.org/en/download/)
- Yarn ([v1](https://classic.yarnpkg.com/en/docs/install/) or [v2+](https://yarnpkg.com/getting-started/install))
- [Git](https://git-scm.com/downloads)

## Quickstart

To get started with Scaffold-ETH 2, follow the steps below:

1. Clone this repo & install dependencies

```
git clone https://github.com/scaffold-eth/scaffold-eth-2.git
cd scaffold-eth-2
yarn install
```

2. Run a local network in the first terminal:

```
yarn chain
```

This command starts a local Ethereum network using Hardhat. The network runs on your local machine and can be used for testing and development. You can
customize the network configuration in `hardhat.config.ts`.

3. On a second terminal, deploy the test contract:

```
yarn deploy
```

This command deploys a test smart contract to the local network. The contract is located in `packages/hardhat/contracts` and can be modified to suit your needs.
The `yarn deploy` command uses the deploy script located in `packages/hardhat/deploy` to deploy the contract to the network. You can also customize the deploy
script.

4. On a third terminal, start your NextJS app:

```
yarn start
```

### Deploy on Goerli & Polygon Mumbai:

``` 
yarn deploy --network goerli --reset
```

### Deploy on Sepolia & Polygon Mumbai:

``` 
yarn deploy --network sepolia --reset
yarn deploy --network polygonMumbai --reset
```

### Deploy & Verify on Sepolia:

``` 
yarn verify --network sepolia
``` 

Register upkeep (Simple DCA #1):
0x000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000064
0x0000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000006500000000000000000000000000000000000000000000000000000000000000c8
0x000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000c9000000000000000000000000000000000000000000000000000000000000012c
0x0000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000012d0000000000000000000000000000000000000000000000000000000000000190
0x0000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000019100000000000000000000000000000000000000000000000000000000000001f4