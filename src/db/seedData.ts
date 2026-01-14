import { AppError } from "../shared/error";
import { uuid } from "../shared/utils/uuid";
import { db } from "./db";
import { categoriesTable, Necessity, TransactionType } from "./schema";

const defaultCategories: {
  name: string;
  necessity: string | null;
  transactionType: TransactionType;
}[] = [
  // Income
  { name: "Salary", necessity: null, transactionType: TransactionType.INCOME },

  // Expenses — MUST
  {
    name: "Essentials",
    necessity: Necessity.MUST,
    transactionType: TransactionType.EXPENSE,
  },
  {
    name: "Bills & Utilities",
    necessity: Necessity.MUST,
    transactionType: TransactionType.EXPENSE,
  },
  {
    name: "Work Expenses",
    necessity: Necessity.MUST,
    transactionType: TransactionType.EXPENSE,
  },
  {
    name: "Health",
    necessity: Necessity.MUST,
    transactionType: TransactionType.EXPENSE,
  },
  {
    name: "Savings",
    necessity: Necessity.MUST,
    transactionType: TransactionType.EXPENSE,
  },

  // Expenses — NEEDS
  {
    name: "Grocery",
    necessity: Necessity.NEEDS,
    transactionType: TransactionType.EXPENSE,
  },
  {
    name: "Transportation",
    necessity: Necessity.NEEDS,
    transactionType: TransactionType.EXPENSE,
  },

  // Expenses — WANTS
  {
    name: "Lifestyle",
    necessity: Necessity.WANTS,
    transactionType: TransactionType.EXPENSE,
  },
  {
    name: "Entertainment",
    necessity: Necessity.WANTS,
    transactionType: TransactionType.EXPENSE,
  },
];

export async function seedData() {
  try {
    await db.transaction(async (tx) => {
      // Create a meta table for seed tracking
      await tx.run(`
      CREATE TABLE IF NOT EXISTS __app_meta (
        key TEXT PRIMARY KEY, 
        value TEXT
      )
      `);

      const row = tx.get<{ value: string }>(
        `SELECT value FROM __app_meta WHERE key = "seed_categories_v1"`
      );

      if (row) {
        console.log("Did not seed");
        return;
      }

      const existing = await tx.select().from(categoriesTable);
      const existingNames = new Set(existing.map((c) => c.name));

      const missing = defaultCategories.filter(
        (c) => !existingNames.has(c.name)
      );

      if (missing.length > 0) {
        const values = missing
          .map(
            (c) =>
              `('${uuid()}', '${c.name}', ${c.necessity ? `'${c.necessity}'` : "NULL"}, '${c.transactionType}')`
          )
          .join(", ");

        await tx.run(`
          INSERT INTO categories (id, name, necessity, transaction_type)
          VALUES ${values}
        `);
      }

      // for (const category of defaultCategories) {
      //   // Check if category already exist
      //   const [found] = await tx
      //     .select()
      //     .from(categoriesTable)
      //     .where(eq(categoriesTable.name, category.name));

      //   if (found) {
      //     await tx
      //       .update(categoriesTable)
      //       .set(category)
      //       .where(eq(categoriesTable.id, found.id));
      //   } else {
      //     await tx.insert(categoriesTable).values({
      //       id: uuid(),
      //       ...category,
      //     });
      //   }
      // }

      tx.run(
        `INSERT INTO __app_meta (key, value) VALUES ("seed_categories_v1", "1")`
      );

      console.log("Seeding finished");
    });
  } catch (err) {
    console.log(err);
    if (err instanceof AppError) {
      throw err;
    } else {
      throw new AppError("Failed to seed data");
    }
  }
}
