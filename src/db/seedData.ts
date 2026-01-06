// import { db } from ".";
import { AppError } from "../shared/error";
import { uuid } from "../shared/utils/uuid";
import { db } from "./db";
import { categoriesTable, Necessity } from "./schema";

const defaultCategories: {
  name: string;
  necessity: string;
}[] = [
  {
    name: "Salary",
    necessity: "",
  },
  {
    name: "Loans",
    necessity: Necessity.WANTS,
  },
  {
    name: "Essentials",
    necessity: Necessity.MUST,
  },
  {
    name: "Lifestyle",
    necessity: Necessity.WANTS,
  },
  {
    name: "Grocery",
    necessity: Necessity.NEEDS,
  },
  {
    name: "Savings",
    necessity: Necessity.MUST,
  },
];

export async function seedData() {
  try {
    const existing = await db.select().from(categoriesTable).limit(1);

    if (existing.length > 0) return;

    await db.transaction(async (tx) => {
      for (const category of defaultCategories) {
        await tx.insert(categoriesTable).values({
          id: uuid(),
          ...category,
        });
      }
    });
  } catch (err) {
    if (err instanceof AppError) {
      throw err;
    } else {
      throw new AppError("Failed to seed data");
    }
  }
}
