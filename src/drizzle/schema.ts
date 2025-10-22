import { integer, pgEnum, pgTable, uniqueIndex, uuid, varchar, } from "drizzle-orm/pg-core";


export const UserRole = pgEnum("userRole", ["ADMIN", "BASIC"]);


/*
  Indexing notes:
  - An index is an auxiliary structure that speeds up lookups, ORDER BY, and JOINs.
  - Unique constraints (like `.unique()` on a column) create a unique index under the hood in Postgres.
    => In this schema `email` has `.unique()` which already creates a unique index.
  - The explicit `uniqueIndex` below is therefore redundant; you can remove either `.unique()` or the
    `uniqueIndex` definition to avoid duplication.
  - Add indexes for columns frequently used in WHERE, JOIN, or ORDER BY (high-cardinality columns are best).
  - Avoid indexing very low-cardinality columns (e.g., boolean) unless used in composite/partial indexes.
  - Consider partial indexes (indexing only a subset) or composite indexes when appropriate.
  - Use EXPLAIN/ANALYZE to confirm whether queries actually use your indexes.
*/

export const UserTable = pgTable("users", {
  // id: serial("id").primaryKey(), // Id as primary which  auto increments one by one
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  age: integer("age").notNull(),
  // `.unique()` here creates a unique constraint + unique index in Postgres
  email: varchar("email", { length: 255 }).notNull().unique(),
  role: UserRole("role").default("BASIC").notNull(),
}, table => {
  return {
    // This explicitly creates a unique index on email.
    // NOTE: it's redundant because of the `.unique()` above — choose one approach.
    emailIndex: uniqueIndex("emailIndex").on(table.email)
  }
})