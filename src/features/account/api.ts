import { db } from "@/src/db";
import { accountsTable } from "@/src/db/schema";
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
}
