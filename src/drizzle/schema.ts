import {
  integer,
  pgEnum,
  pgTable,
  uniqueIndex,
  uuid,
  varchar,
  unique,
  boolean,
  real,
  timestamp,
  primaryKey
} from "drizzle-orm/pg-core";


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
    emailIndex: uniqueIndex("emailIndex").on(table.email),
    // What if i want the user to have unique name and age combination
    uniqueNameAndAge: unique("uniqueNameAndAge").on(table.name, table.age)
  }
})

// one to one relation
export const UserPreferences = pgTable("userPreferences", {
  id: uuid("id").primaryKey().defaultRandom(),
  emailUpdates: boolean("emailUpdates").notNull().default(false),
  //Foreign key
  userId: uuid("userId").references(() => UserTable.id).notNull(),
})

// One to many relation
export const PostTable = pgTable("postTable", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 255 }).notNull(),
  averageRating: real("averageRating").notNull().default(0), // As we know float is not available in postgres so we will use
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  deletedAt: timestamp("deletedAt").notNull().defaultNow(),
  authorId: uuid("authorId").references(() => UserTable.id).notNull()
})

// Many to many relation
// Why this structure?
// - A many-to-many relationship cannot be represented by a single foreign key on one table.
// - We use a dedicated join table (postCategoryTable) that stores pairs (postId, categoryId).
//   Each row means "this post is in this category".
// - Referential integrity: each column references its parent table so the DB prevents invalid pairs.
// - Composite primary key (postId, categoryId):
//     * Ensures uniqueness of each post-category pair (no duplicate associations).
//     * Serves as an index for fast lookup when querying categories for a post or posts for a category.
//     * Avoids an unnecessary surrogate id when the pair itself is the natural unique identifier.
// - Alternatives: if you need metadata on the association (e.g., addedAt), keep this table and add columns.
// - Performance: depending on query patterns, you may add additional indexes; composite PK already helps common lookups.

export const CategoryTable = pgTable("categoryTable", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull().unique(),
})

export const PostCategoryTable = pgTable("postCategoryTable", {
  postId: uuid("postId").references(() => PostTable.id).notNull(),
  categoryId: uuid("categoryId").references(() => CategoryTable.id).notNull(),

}, table => {
  return {
    // Composite primary key ensures that each post-category pair is unique
    pk: primaryKey({ columns: [table.postId, table.categoryId] })
  }
})