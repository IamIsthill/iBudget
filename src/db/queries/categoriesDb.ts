import { db } from "../db";
import { categoriesTable } from "../schema";

export class CategoriesDb {
  static getAll() {
    return db.select().from(categoriesTable);
  }
}
