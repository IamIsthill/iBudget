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
