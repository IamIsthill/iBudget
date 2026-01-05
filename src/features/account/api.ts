import { db } from "@/src/db";
import { accountsTable } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import * as Crypto from "expo-crypto";

export class AccountDB {
  static async add(name: string, balance = 0) {
    const id = Crypto.randomUUID();
    return await db
      .insert(accountsTable)
      .values({ id, name, balance })
      .returning();
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
}
