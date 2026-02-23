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

    // Create Sample Lecture
    await prisma.lecture.create({
        data: {
            title: 'Introduction to Databases',
            description: 'Learn the fundamentals of relational databases and SQL.',
            content: '# Introduction to Databases\n\nA database is an organized collection of structured information, or data, typically stored electronically in a computer system.\n\n## What is SQL?\nSQL stands for Structured Query Language. It is used for storing, manipulating and retrieving data in databases.',
            is_published: true,
            created_by: admin.id,
        }
    });
    console.log('Created sample lecture');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
