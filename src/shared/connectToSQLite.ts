import * as SQLite from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";

export default function connectToSQLite() {
  const expo = SQLite.openDatabaseSync("db.db");
  const db = drizzle(expo);

  return {
    expo,
    db,
  };
}
