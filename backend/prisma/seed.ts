import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding database...');

    // Create Admin
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@pushthebar.com' },
        update: {},
        create: {
            email: 'admin@pushthebar.com',
            name: 'Deepak (Admin)',
            password_hash: adminPassword,
            role: 'ADMIN',
        },
    });
    console.log(`Created admin: ${admin.email}`);

    // Create User (Her)
    const userPassword = await bcrypt.hash('user123', 10);
    const user = await prisma.user.upsert({
        where: { email: 'user@pushthebar.com' },
        update: {},
        create: {
            email: 'user@pushthebar.com',
            name: 'Minni',
            password_hash: userPassword,
            role: 'USER',
        },
    });
    console.log(`Created user: ${user.email}`);

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
