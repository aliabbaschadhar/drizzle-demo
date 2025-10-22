import { db } from "./drizzle/db";
import { UserTable } from "./drizzle/schema";

async function main() {
  const user = await db.insert(UserTable).values({
    name: "Shaka-g",
  }).returning();
  // const user = await db.query.UserTable.findFirst();
  console.log("New created user is:", user)
}

main();