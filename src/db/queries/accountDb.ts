import { eq } from "drizzle-orm";
import { db } from "../db";
import { accountsTable } from "@/src/db/schema";
import { uuid } from "@/src/shared/utils/uuid";

interface CreateAccount {
  name: string;
  balance: number;
  isDefault: boolean;
}

export class AccountDB {
  static async add(payload: CreateAccount) {
    return await db.transaction(async (tx) => {
      if (payload.isDefault) {
        await tx.update(accountsTable).set({ isDefault: false });
      }
      const id = uuid();
      const result = await tx
        .insert(accountsTable)
        .values({ id, ...payload })
        .returning();

      return result[0]; // Return the first (and only) inserted account
    });
  }

  static getAll() {
    return db.select().from(accountsTable);
  }

  static getById(id: string) {
    return db.select().from(accountsTable).where(eq(accountsTable.id, id));
  }

  static async update(id: string, data: { name: string; balance: number }) {
    return await db
      .update(accountsTable)
      .set(data)
      .where(eq(accountsTable.id, id));
  }

  static async delete(id: string) {
    return await db.delete(accountsTable).where(eq(accountsTable.id, id));
  }

  static async getDefaultAccount() {
    const accounts = await db
      .select()
      .from(accountsTable)
      .where(eq(accountsTable.isDefault, true));

    return accounts[0];
  }
}
