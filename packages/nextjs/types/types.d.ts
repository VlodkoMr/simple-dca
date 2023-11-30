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