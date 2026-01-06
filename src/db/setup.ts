import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import migrations from "../drizzle/migrations";
import { useEffect, useState } from "react";
import { seedData } from "./seedData";
import { db } from "./db";

export function useDatabaseSetup() {
  const { success, error } = useMigrations(db, migrations);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!success) return;

    (async () => {
      await seedData();
      setReady(true);
    })();
  }, [success]);

  return { ready, error };
}
