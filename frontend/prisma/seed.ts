import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding database...');

    // Create Admin
    const admin = await prisma.user.upsert({
        where: { username: 'chimarkhi' },
        update: {},
        create: {
            username: 'chimarkhi',
            name: 'Deepak (Admin)',
            password: 'MinnisDaddy2904',
            role: 'ADMIN',
        },
    });
    console.log(`Created admin: ${admin.username}`);

    // Create User (Her)
    const user = await prisma.user.upsert({
        where: { username: 'vedika2904' },
        update: {},
        create: {
            username: 'vedika2904',
            name: 'Vedika',
            password: 'Myname@2904',
            role: 'USER',
        },
    });
    console.log(`Created user: ${user.username}`);

    // Note: Lectures are seeded separately via seed_sql_notes.ts
    // No sample lectures created here to avoid duplicates.
    console.log('Seed complete (users only). Run seed_sql_notes.ts to seed lectures.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
