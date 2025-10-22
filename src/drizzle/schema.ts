import { serial } from "drizzle-orm/mysql-core";
import { integer, pgTable, uuid, varchar, } from "drizzle-orm/pg-core";
import { drizzle } from "drizzle-orm/postgres-js";
const db = drizzle(process.env.DATABASE_URL as string);

export const UserTable = pgTable("users", {
  // id: serial("id").primaryKey(), // Id as primary which  auto increments one by one
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull()
})