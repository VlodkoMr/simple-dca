interface Strategy {
  id: number;
  title: string;
  active: boolean;
  assetFromTitle: string;
  assetToTitle: string;
  fromAsset: string;
  toAsset: string;
  totalAmountFromAsset: string;
  totalAmountToAsset: string;
  usersLimit: number;
  balancerPoolId: string;
}

interface UserStrategy {
  strategyId: number;
  active: boolean;
  amountLeft: number;
  amountOnce: number;
  claimAvailable: number;
  executeRepeat: number;
  nextExecute: number;
}