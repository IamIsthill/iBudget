import * as d from "drizzle-orm/sqlite-core";

export const accountsTable = d.sqliteTable("accounts", {
  id: d.text("id").primaryKey(),
  name: d.text("name").notNull(),
  balance: d.integer().default(0),
});
