require("dotenv").config();
const prisma = require("../src/db/prisma");
const bcrypt = require("bcrypt");

async function main() {
  const superAdminExists = await prisma.user.findFirst({
    where: {
      role: "SUPER_ADMIN",
    },
  });

  if (superAdminExists) {
    console.log("Super Admin already exists");
    return;
  }

  const hashedPassword = await bcrypt.hash("superadminpassword", 10);
  const superAdmin = await prisma.user.create({
    data: {
      name: "Admin",
      email: "superadmin@example.com",
      password: hashedPassword,
      role: "SUPER_ADMIN",
      bio: "Super Admin",
      avatar: "https://example.com/avatar.jpg",
    },
  });

  console.log("Superadmin berhasil dibuat", superAdmin);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
