const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("Test1234!", 10);

  // check if superadmin already exists
  const existing = await prisma.user.findUnique({
    where: { email: "superadmin@example.com" },
  });

  if (!existing) {
    await prisma.user.create({
      data: {
        name: "Super Admin",
        email: "superadmin@example.com",
        password: hashedPassword,
        roles: {
          create: {
            role: {
              create: {
                name: "superadmin",
                permissions: ["*"],
              },
            },
          },
        },
      },
    });
    console.log("✅ Super Admin seeded!");
  } else {
    console.log("⚠️ Super Admin already exists, skipping seed.");
  }
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
