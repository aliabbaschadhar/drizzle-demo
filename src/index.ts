import { db } from "./drizzle/db";
import { UserTable } from "./drizzle/schema";

async function main() {
  await db.delete(UserTable)
  const user = await db.insert(UserTable).values([{
    name: "Shaka-g",
    age: 22,
    email: `${Math.random().toString(36).substring(2, 15)}@example.com`,
    role: "BASIC"
  }, {
    name: "Ali",
    age: 22,
    email: `${Math.random().toString(36).substring(2, 15)}@example.com`,
    role: "ADMIN"
  }, {
    name: "Ali Abbas",
    age: 23,
    email: `${Math.random().toString(36).substring(2, 15)}@example.com`,
    role: "BASIC"
  }]).returning({
    id: UserTable.id,
    name: UserTable.name,
    email: UserTable.email,
    role: UserTable.role
  }).onConflictDoUpdate({
    target: [UserTable.age, UserTable.name],
    set: {
      name: `Updated Name + ${Math.floor(Math.random() * 100)}`,
      age: 23 + Math.floor(Math.random() * 10),
    }
  })
  // const user = await db.query.UserTable.findFirst();
  console.log("New created user is:", user)

  const updatedUser = await db.insert(UserTable).values({
    name: "Ali",
    age: 22,
    email: "hello@gmail.com",
    role: "BASIC"
  }).returning({
    id: UserTable.id,
    name: UserTable.name,
    age: UserTable.age
  }).onConflictDoUpdate({
    target: [UserTable.age, UserTable.name],
    set: {
      age: 60,
      name: "Updated Name"
    }
  })
  console.log("Updated user:", updatedUser)


}

main();