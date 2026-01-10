import { db } from "@/src/db";
import {
  accountsTable,
  transactionsTable,
  TransactionType,
} from "@/src/db/schema";
import { AppError } from "@/src/shared/error";
import { uuid } from "@/src/shared/utils/uuid";
import { eq, sql } from "drizzle-orm";

export class TransactionCommands {
  private static async createExpense(payload: CreateExpenseTransaction) {
    return await db.transaction(async (tx) => {
      await tx
        .update(accountsTable)
        .set({
          balance: sql`${accountsTable.balance} - ${payload.amount}`,
        })
        .where(eq(accountsTable.id, payload.fromAccountId));

      await tx.insert(transactionsTable).values({
        ...payload,
        id: uuid(),
        type: TransactionType.EXPENSE,
      });
    });
  }

  private static async createIncome(payload: CreateIncomeTransaction) {
    return await db.transaction(async (tx) => {
      await tx
        .update(accountsTable)
        .set({
          balance: sql`${accountsTable.balance} + ${payload.amount}`,
        })
        .where(eq(accountsTable.id, payload.fromAccountId));

      await tx.insert(transactionsTable).values({
        ...payload,
        id: uuid(),
        type: TransactionType.INCOME,
      });
    });
  }

  private static async createTransfer(payload: CreateTransferTransaction) {
    return await db.transaction(async (tx) => {
      // Check if transferring to same account
      if (payload.fromAccountId === payload.toAccountId)
        throw new AppError("You cannot transfer to the same account");

      // Check source account if it has sufficient balance
      const [sourceAccount] = await tx
        .select()
        .from(accountsTable)
        .where(eq(accountsTable.id, payload.fromAccountId));
      if (payload.amount > sourceAccount.balance)
        throw new AppError(
          `Account ${sourceAccount.name} has insufficient funds`
        );

      // Outgoing
      await tx
        .update(accountsTable)
        .set({
          balance: sql`${accountsTable.balance} - ${payload.amount}`,
        })
        .where(eq(accountsTable.id, payload.fromAccountId));

      //Receiving
      await tx
        .update(accountsTable)
        .set({
          balance: sql`${accountsTable.balance} + ${payload.amount}`,
        })
        .where(eq(accountsTable.id, payload.toAccountId));

      await tx.insert(transactionsTable).values({
        ...payload,
        type: TransactionType.TRANSFER,
        id: uuid(),
      });
    });
  }

  static async createTransaction({
    amount,
    date,
    description,
    fromAccountId,
    type,
    categoryId,
    toAccountId,
  }: CreateTransaction) {
    switch (type) {
      case TransactionType.INCOME: {
        if (!categoryId)
          throw new AppError(
            "categoryId is required for an Income Transaction"
          );

        return await TransactionCommands.createIncome({
          amount,
          categoryId,
          date,
          description,
          fromAccountId,
        });
      }

      case TransactionType.EXPENSE: {
        if (!categoryId)
          throw new AppError("Category is required for an Expense Transaction");

        return await TransactionCommands.createExpense({
          amount,
          categoryId,
          date,
          description,
          fromAccountId,
        });
      }

      case TransactionType.TRANSFER: {
        if (!toAccountId) {
          throw new AppError(
            "Target Account is required for a Transfer Transaction"
          );
        }

        return await TransactionCommands.createTransfer({
          amount,
          date,
          description,
          fromAccountId,
          toAccountId,
        });
      }
    }
  }
}
interface CreateTransaction {
  fromAccountId: string;
  toAccountId?: string;
  categoryId?: string;
  amount: number;
  type: TransactionType;
  date: number;
  description: string;
}

interface CreateExpenseTransaction {
  fromAccountId: string;
  categoryId: string;
  amount: number;
  date: number;
  description: string;
}

interface CreateIncomeTransaction {
  fromAccountId: string;
  categoryId: string;
  amount: number;
  date: number;
  description: string;
}

interface CreateTransferTransaction {
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  date: number;
  description: string;
}
