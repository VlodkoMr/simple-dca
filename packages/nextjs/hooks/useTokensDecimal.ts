import {useCallback, useEffect, useState} from "react";
import {erc20ABI, useContractReads} from "wagmi";


export const useTokensDecimal = ({
  allStrategies,
}: {
  allStrategies: any[];
}) => {

  const [tokenList, setTokenList] = useState<string[]>([]);
  const [contractRequests, setContractRequests] = useState<any[]>([]);

  const {data: tokenDecimals, isError, isLoading} = useContractReads({
    contracts: contractRequests,
    enabled: !!contractRequests,
    cacheTime: 5_000,
    select: (data) => {
      const newData: Record<string, number> = {};
      tokenList.forEach((tonenAddress: string, index) => {
        newData[tonenAddress] = data[index].result as number;
      });
      return newData;
    }
  });

  const fetchTokenDecimals = useCallback(() => {
    let tokensList: string[] = [];
    allStrategies.filter(strategy => strategy).map((strategy: Strategy) => {
      if (tokensList.indexOf(strategy.fromAsset) === -1) {
        tokensList.push(strategy.fromAsset);
      }
      if (tokensList.indexOf(strategy.toAsset) === -1) {
        tokensList.push(strategy.toAsset);
      }
    });
    setTokenList(tokensList);

    const contractRequests = tokensList.map((tokenAddress) => {
      return {
        address: tokenAddress,
        abi: erc20ABI,
        functionName: 'decimals',
      };
    });

    setContractRequests(contractRequests);
  }, [allStrategies]);


  useEffect(() => {
    if (allStrategies) {
      fetchTokenDecimals();
    }
  }, [allStrategies]);

  return {
    tokenDecimals,
    isError,
    isLoading
  };
};
