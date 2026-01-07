import { uuid } from "@/src/shared/utils/uuid";
import { db } from "../db";
import { accountsTable, transactionsTable, TransactionType } from "../schema";
import { eq, sql } from "drizzle-orm";

interface AddTransaction {
  fromAccountId: string;
  toAccountId: string | null;
  categoryId: string | null;
  necessity: string | null;
  amount: number;
  type: TransactionType;
  date: number;
  description: string;
}

export class TransactionDb {
  static async add(payload: AddTransaction) {
    return await db.transaction(async (tx) => {
      switch (payload.type) {
        case TransactionType.INCOME: {
          const amount = payload.amount * 1;

          await tx
            .update(accountsTable)
            .set({
              balance: sql`${accountsTable.balance} + ${amount}`,
            })
            .where(eq(accountsTable.id, payload.fromAccountId));

          await tx.insert(transactionsTable).values({
            id: uuid(),
            fromAccountId: payload.fromAccountId,
            categoryId: payload.categoryId,
            amount,
            type: payload.type,
            date: payload.date,
            description: payload.description,
          });
          break;
        }

        case TransactionType.EXPENSE: {
          const amount = payload.amount * -1;

          await tx
            .update(accountsTable)
            .set({
              balance: sql`${accountsTable.balance} + ${amount}`,
            })
            .where(eq(accountsTable.id, payload.fromAccountId));

          await tx.insert(transactionsTable).values({
            id: uuid(),
            fromAccountId: payload.fromAccountId,
            categoryId: payload.categoryId,
            necessity: payload.necessity,
            amount,
            type: payload.type,
            date: payload.date,
            description: payload.description,
          });
          break;
        }

        case TransactionType.TRANSFER: {
          // Outgoing amount
          await tx
            .update(accountsTable)
            .set({
              balance: sql`${accountsTable.balance} + ${payload.amount * -1}`,
            })
            .where(eq(accountsTable.id, payload.fromAccountId));

          // Outgoing Transaction
          await tx.insert(transactionsTable).values({
            id: uuid(),
            fromAccountId: payload.fromAccountId,
            toAccountId: payload.toAccountId,
            amount: payload.amount * -1,
            type: payload.type,
            date: payload.date,
            description: payload.description,
          });

          // Incoming amount
          await tx
            .update(accountsTable)
            .set({
              balance: sql`${accountsTable.balance} + ${payload.amount * 1}`,
            })
            .where(eq(accountsTable.id, payload.fromAccountId));

          // Outgoing Transaction
          await tx.insert(transactionsTable).values({
            id: uuid(),
            fromAccountId: payload.toAccountId!,
            toAccountId: payload.fromAccountId,
            amount: payload.amount * 1,
            type: payload.type,
            date: payload.date,
            description: payload.description,
          });
        }
      }
    });
  }
}
