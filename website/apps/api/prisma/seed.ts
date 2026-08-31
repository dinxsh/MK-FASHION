import { AdminRole, AdminStatus, PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const name = process.env.ADMIN_SEED_NAME ?? 'MK Admin';
  const email = (process.env.ADMIN_SEED_EMAIL ?? 'admin@mkfashion.in').toLowerCase();
  const password = process.env.ADMIN_SEED_PASSWORD ?? 'mkfashion2026';

  const passwordHash = await bcrypt.hash(password, 10);

  const admin = await prisma.adminUser.upsert({
    where: { email },
    update: {
      name,
      passwordHash,
      role: AdminRole.ADMIN,
      status: AdminStatus.ACTIVE,
    },
    create: {
      name,
      email,
      passwordHash,
      role: AdminRole.ADMIN,
      status: AdminStatus.ACTIVE,
    },
  });

  console.log(`Seeded admin user: ${admin.email}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
