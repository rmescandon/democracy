export type Proposal = {
  id: number;
  title: string;
  description: string;
  yesCount: number;
  noCount: number;
  completed: boolean;
};

export type Account = {
  address: string;
  balance: string;
  chainId: string;
  network: string;
};
