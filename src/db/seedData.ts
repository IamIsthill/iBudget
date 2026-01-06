import { db } from ".";
import { AppError } from "../shared/error";
import { uuid } from "../shared/utils/uuid";
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

async function seedCategories() {
  try {
    const mappedCategories = defaultCategories.map(async (category) => {
      const id = uuid();
      await db.insert(categoriesTable).values({ ...category, id });
    });

    await Promise.all(mappedCategories);
  } catch {
    throw new AppError("Failed to seed categories");
  }
}

export async function seedData() {
  try {
    await seedCategories();
  } catch (err) {
    if (err instanceof AppError) {
      throw err;
    } else {
      throw new AppError("Failed to seed data");
    }
  }
}
