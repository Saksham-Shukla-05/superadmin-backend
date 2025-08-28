const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("Test1234!", 10);

  await prisma.user.create({
    data: {
      name: "Super Admin",
      email: "superadmin@example.com",
      password: hashedPassword,
      roles: {
        create: [{ name: "superadmin", permissions: ["*"] }],
      },
    },
  });

  console.log("✅ Super Admin seeded!");
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
