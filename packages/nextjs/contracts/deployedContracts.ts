/**
 * This file is autogenerated by Scaffold-ETH.
 * You should not edit it manually or your changes might be overwritten.
 */
import { GenericContractsDeclaration } from "~~/utils/scaffold-eth/contract";

const deployedContracts = {
  5: {
    SimpleDCA: {
      address: "0x9C8cE0b4d1C7a0CD0e27ACe1CaE584c9DC5bb52c",
      abi: [
        {
          inputs: [
            {
              internalType: "address",
              name: "_initialOwner",
              type: "address",
            },
            {
              internalType: "address",
              name: "_balancerVault",
              type: "address",
            },
            {
              internalType: "address",
              name: "_feeCollector",
              type: "address",
            },
          ],
          stateMutability: "nonpayable",
          type: "constructor",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "target",
              type: "address",
            },
          ],
          name: "AddressEmptyCode",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "account",
              type: "address",
            },
          ],
          name: "AddressInsufficientBalance",
          type: "error",
        },
        {
          inputs: [],
          name: "FailedInnerCall",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "owner",
              type: "address",
            },
          ],
          name: "OwnableInvalidOwner",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "account",
              type: "address",
            },
          ],
          name: "OwnableUnauthorizedAccount",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "token",
              type: "address",
            },
          ],
          name: "SafeERC20FailedOperation",
          type: "error",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "previousOwner",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "newOwner",
              type: "address",
            },
          ],
          name: "OwnershipTransferred",
          type: "event",
        },
        {
          inputs: [
            {
              internalType: "uint32",
              name: "_strategyId",
              type: "uint32",
            },
            {
              internalType: "uint256",
              name: "_executeRepeat",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "_amountOnce",
              type: "uint256",
            },
          ],
          name: "activate",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [],
          name: "balancerVault",
          outputs: [
            {
              internalType: "contract IVault",
              name: "",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes",
              name: "checkData",
              type: "bytes",
            },
          ],
          name: "checkUpkeep",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
            {
              internalType: "bytes",
              name: "",
              type: "bytes",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint32",
              name: "_strategyId",
              type: "uint32",
            },
          ],
          name: "deactivate",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "_amount",
              type: "uint256",
            },
            {
              internalType: "uint32",
              name: "_strategyId",
              type: "uint32",
            },
          ],
          name: "deposit",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [],
          name: "feeCollector",
          outputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "_fromAsset",
              type: "address",
            },
            {
              internalType: "address",
              name: "_toAsset",
              type: "address",
            },
            {
              internalType: "bytes32",
              name: "_balancerPoolId",
              type: "bytes32",
            },
            {
              internalType: "uint32",
              name: "_usersLimit",
              type: "uint32",
            },
          ],
          name: "newStrategy",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [],
          name: "owner",
          outputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes",
              name: "_performData",
              type: "bytes",
            },
          ],
          name: "performUpkeep",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [],
          name: "renounceOwnership",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint32",
              name: "",
              type: "uint32",
            },
          ],
          name: "strategies",
          outputs: [
            {
              internalType: "address",
              name: "fromAsset",
              type: "address",
            },
            {
              internalType: "address",
              name: "toAsset",
              type: "address",
            },
            {
              internalType: "bytes32",
              name: "balancerPoolId",
              type: "bytes32",
            },
            {
              internalType: "uint256",
              name: "totalAmountFromAsset",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "totalAmountToAsset",
              type: "uint256",
            },
            {
              internalType: "uint32",
              name: "usersCount",
              type: "uint32",
            },
            {
              internalType: "uint32",
              name: "usersLimit",
              type: "uint32",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint32",
              name: "",
              type: "uint32",
            },
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          name: "strategyUsers",
          outputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "totalStrategies",
          outputs: [
            {
              internalType: "uint32",
              name: "",
              type: "uint32",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "newOwner",
              type: "address",
            },
          ],
          name: "transferOwnership",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          name: "userStrategies",
          outputs: [
            {
              internalType: "uint32",
              name: "",
              type: "uint32",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
            {
              internalType: "uint32",
              name: "",
              type: "uint32",
            },
          ],
          name: "userStrategyDetails",
          outputs: [
            {
              internalType: "uint256",
              name: "amountLeft",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "amountOnce",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "nextExecute",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "executeRepeat",
              type: "uint256",
            },
            {
              internalType: "bool",
              name: "active",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
      ],
      inheritedFunctions: {
        checkUpkeep: "@chainlink/contracts/src/v0.8/automation/interfaces/AutomationCompatibleInterface.sol",
        performUpkeep: "@chainlink/contracts/src/v0.8/automation/interfaces/AutomationCompatibleInterface.sol",
        owner: "@openzeppelin/contracts/access/Ownable.sol",
        renounceOwnership: "@openzeppelin/contracts/access/Ownable.sol",
        transferOwnership: "@openzeppelin/contracts/access/Ownable.sol",
      },
    },
  },
} as const;

export default deployedContracts satisfies GenericContractsDeclaration;
