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

export type Delegate = {
  address: string;
  percentage: number;
};

export type Vote = {
  address: string;
  proposalId: number;
  // option is a number, but represents a string yes, no, or abstain
  // so we can use a union type to represent the three options
  // 0 = abstainm, 1 = yes, 2 = no,
  option: 0 | 1 | 2;
};
