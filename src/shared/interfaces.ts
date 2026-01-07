import { Necessity } from "../db/schema";

export interface Account {
  id: string;
  name: string;
  balance: number;
  isDefault: boolean;
}

export interface Category {
  id: string;
  name: string;
  necessity: null | Necessity | string;
}

export interface Transaction {
  id: string;
  accountId: string;
  categoryId?: string | null;
  necessity?: string | null;
  amount: number;
  type: string;
  date: number;
  description: string;
}
