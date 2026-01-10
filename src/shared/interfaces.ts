export interface Account {
  id: string;
  name: string;
  balance: number;
  isDefault: boolean;
}

export interface Category {
  id: string;
  name: string;
  necessity: string | null;
}

export interface Transaction {
  id: string;
  fromAccountId: string;
  toAccountId: string | null;
  categoryId: string | null;
  amount: number;
  type: string;
  date: number;
  description: string;
}

export interface HydratedTransaction {
  date: number;
  id: string;
  fromAccountId: string;
  toAccountId: string | null;
  categoryId: string | null;
  amount: number;
  type: string;
  description: string | null;
  fromAccount: Account;
  toAccount: Account | null;
  category: Category | null;
}
