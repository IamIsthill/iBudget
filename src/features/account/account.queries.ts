import { db } from "@/src/db";
import { accountsTable } from "@/src/db/schema";
import { eq } from "drizzle-orm";

export class AccountQueries {
  static getAccounts() {
    return db.select().from(accountsTable);
  }

  static getAccount(id: string) {
    return db.select().from(accountsTable).where(eq(accountsTable.id, id));
  }
}
