import { serial } from "drizzle-orm/mysql-core";
import { integer, pgTable, uuid, varchar, } from "drizzle-orm/pg-core";

export const UserTable = pgTable("users", {
  // id: serial("id").primaryKey(), // Id as primary which  auto increments one by one
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull()
})