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

    const setup = async () => {
      try {
        await seedData();
      } catch (err) {
        console.log(err);
      } finally {
        setReady(true);
      }
    };
    setup();
  }, [success]);

  return { ready, error };
}
