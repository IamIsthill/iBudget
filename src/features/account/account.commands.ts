import { db } from "@/src/db";
import { accountsTable } from "@/src/db/schema";
import { uuid } from "@/src/shared/utils/uuid";
import { eq } from "drizzle-orm";

export class AccountCommands {
  static async createAccount(payload: CreateAccount) {
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

  static async toggleAccountDefault(id: string) {
    return await db.transaction(async (tx) => {
      const [account] = await tx
        .select()
        .from(accountsTable)
        .where(eq(accountsTable.id, id));

      if (!account.isDefault) {
        await tx
          .update(accountsTable)
          .set({ isDefault: false })
          .where(eq(accountsTable.isDefault, true));

        return await tx
          .update(accountsTable)
          .set({ isDefault: true })
          .where(eq(accountsTable.id, id));
      } else {
        return await tx
          .update(accountsTable)
          .set({ isDefault: false })
          .where(eq(accountsTable.id, id));
      }
    });
  }

  static async updateAccount(id: string, payload: UpdateAccount) {
    return await db
      .update(accountsTable)
      .set(payload)
      .where(eq(accountsTable.id, id));
  }

  static async deleteAccount(id: string) {
    return await db.delete(accountsTable).where(eq(accountsTable.id, id));
  }
}

interface CreateAccount {
  name: string;
  balance?: number;
  isDefault: boolean;
}

interface UpdateAccount {
  name: string;
  balance: number;
}
