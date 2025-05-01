export type Proposal = {
  id: string;
  description: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Account = {
  address: string;
  balance: string;
  chainId: string;
  network: string;
};
