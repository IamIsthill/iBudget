import { db } from "@/src/db";
import { accountsTable, categoriesTable } from "@/src/db/schema";

export class TransactionQueries {
  static getTransactionsHydrated() {
    return db.query.transactionsTable.findMany({
      with: {
        fromAccount: true,
        toAccount: true,
        category: true,
      },
      orderBy: (transactions, { desc }) => [desc(transactions.date)],
    });
  }

  static getAccounts() {
    return db.select().from(accountsTable);
  }

  static getCategories() {
    return db.select().from(categoriesTable);
  }
}
