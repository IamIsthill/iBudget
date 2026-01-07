import { relations } from "drizzle-orm";
import * as d from "drizzle-orm/sqlite-core";

export enum TransactionType {
  INCOME = "income",
  EXPENSE = "expense",
  TRANSFER = "transfer",
}

export enum Necessity {
  MUST = "must",
  NEEDS = "needs",
  WANTS = "wants",
}

export const accountsTable = d.sqliteTable("accounts", {
  id: d.text("id").primaryKey(),
  name: d.text("name").notNull(),
  balance: d.integer("balance").default(0).notNull(),
  isDefault: d
    .integer("is_default", { mode: "boolean" })
    .default(false)
    .notNull(),
});

export const categoriesTable = d.sqliteTable("categories", {
  id: d.text("id").primaryKey().notNull(),
  name: d.text("name").notNull().unique(),
  necessity: d.text("necessity").default(""), // 'must' | 'needs' | 'wants'
});

export const transactionsTable = d.sqliteTable("transactions", {
  id: d.text("id").primaryKey().notNull(),
  fromAccountId: d
    .text("fromAccountId")
    .notNull()
    .references(() => accountsTable.id, { onDelete: "set null" }),
  toAccountId: d
    .text("toAccountId")
    .references(() => accountsTable.id, { onDelete: "set null" }),
  categoryId: d
    .text("categoryId")
    .references(() => categoriesTable.id, { onDelete: "set null" }),
  necessity: d.text("necessity"), // 'must' | 'needs' | 'wants'
  amount: d.integer().notNull(), // positive for income, negative for expense
  type: d.text("type").notNull(), // 'income' | 'expense' | 'transfer'
  date: d.integer("date").notNull(), // timestamp
  description: d.text("description"), // optional note
});

// Relations
export const accountTransactionsRelation = relations(
  accountsTable,
  ({ many }) => ({
    transactions: many(transactionsTable),
  })
);

export const categoryTransactionsRelation = relations(
  categoriesTable,
  ({ many }) => ({
    transactions: many(transactionsTable),
  })
);

export const transactionRelations = relations(transactionsTable, ({ one }) => ({
  account: one(accountsTable),
  category: one(categoriesTable),
}));
