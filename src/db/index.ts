import * as SQLite from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import migrations from "../drizzle/migrations";

const expo = SQLite.openDatabaseSync("db.db", { enableChangeListener: true });

export const db = drizzle(expo);

export function useMigration() {
  const result = useMigrations(db, migrations);

  return result;
}
