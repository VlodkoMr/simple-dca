import type {ExtractAbiFunctionNames} from "abitype";
import {useContractRead} from "wagmi";
import {useDeployedContractInfo} from "~~/hooks/scaffold-eth";
import {getTargetNetwork} from "~~/utils/scaffold-eth";
import {
  AbiFunctionReturnType,
  ContractAbi,
  ContractName,
  UseScaffoldReadConfig,
} from "~~/utils/scaffold-eth/contract";
import {getNetwork} from "@wagmi/core";

/**
 * @dev wrapper for wagmi's useContractRead hook which loads in deployed contract contract abi, address automatically
 * @param config - The config settings, including extra wagmi configuration
 * @param config.contractName - deployed contract name
 * @param config.functionName - name of the function to be called
 * @param config.args - args to be passed to the function call
 * @param config.chainId - chainId to be passed to the function call
 */
export const useScaffoldContractRead = <
  TContractName extends ContractName,
  TFunctionName extends ExtractAbiFunctionNames<ContractAbi<TContractName>, "pure" | "view">,
>({
  contractName,
  functionName,
  args,
  chainId,
  ...readConfig
}: UseScaffoldReadConfig<TContractName, TFunctionName>) => {
  // const {chain} = getNetwork();
  const {data: deployedContract} = useDeployedContractInfo(contractName, chainId);

  return useContractRead({
    functionName,
    address: deployedContract?.address,
    abi: deployedContract?.abi,
    watch: true,
    args,
    chainId: chainId,
    enabled: !!chainId && (!Array.isArray(args) || !args.some(arg => arg === undefined)),
    ...(readConfig as any),
  }) as Omit<ReturnType<typeof useContractRead>, "data" | "refetch"> & {
    data: AbiFunctionReturnType<ContractAbi, TFunctionName> | undefined;
    refetch: (options?: {
      throwOnError: boolean;
      cancelRefetch: boolean;
    }) => Promise<AbiFunctionReturnType<ContractAbi, TFunctionName>>;
  };
};
