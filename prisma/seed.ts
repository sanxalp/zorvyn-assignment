import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Clean existing data
  await prisma.record.deleteMany({});
  await prisma.user.deleteMany({});

  const passwordHash = await bcrypt.hash("password123", 10);

  // Create Users
  const admin = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@example.com",
      passwordHash,
      role: "ADMIN",
    },
  });

  const analyst = await prisma.user.create({
    data: {
      name: "Analyst User",
      email: "analyst@example.com",
      passwordHash,
      role: "ANALYST",
    },
  });

  const viewer = await prisma.user.create({
    data: {
      name: "Viewer User",
      email: "viewer@example.com",
      passwordHash,
      role: "VIEWER",
    },
  });

  console.log("Created users:", { admin: admin.email, analyst: analyst.email, viewer: viewer.email });

  // Create some records authored by Admin
  const recordsData = [
    { amount: 5000, type: "INCOME", category: "Salary", date: new Date("2023-10-01"), userId: admin.id, notes: "October Salary" },
    { amount: 1500, type: "EXPENSE", category: "Rent", date: new Date("2023-10-05"), userId: admin.id, notes: "Apartment Rent" },
    { amount: 200, type: "EXPENSE", category: "Utilities", date: new Date("2023-10-08"), userId: admin.id },
    { amount: 800, type: "INCOME", category: "Freelance", date: new Date("2023-10-12"), userId: admin.id, notes: "Web development gig" },
    { amount: 300, type: "EXPENSE", category: "Groceries", date: new Date("2023-10-15"), userId: admin.id },
  ];

  await prisma.record.createMany({
    data: recordsData,
  });

  console.log(`Created ${recordsData.length} dummy records.`);
  console.log("Seeding complete! Use password 'password123' to login.");
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
