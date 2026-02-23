import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';

const prisma = new PrismaClient();

async function main() {
    const content = fs.readFileSync('sql_notes_complete.md', 'utf-8');

    // Check if it already exists to avoid duplicates
    const existing = await prisma.lecture.findFirst({
        where: { title: 'The Ultimate SQL Masterclass' }
    });

    if (existing) {
        await prisma.lecture.update({
            where: { id: existing.id },
            data: { content, description: 'Complete SQL Notes: Basics to Advanced, with query examples and input/output tables.' }
        });
        console.log('SQL Lecture updated successfully!');
    } else {
        await prisma.lecture.create({
            data: {
                title: 'The Ultimate SQL Masterclass',
                description: 'Complete SQL Notes: Basics to Advanced, with query examples and input/output tables.',
                is_published: true,
                content: content
            }
        });
        console.log('SQL Lecture added successfully!');
    }
}

main().catch(e => {
    console.error(e);
    process.exit(1);
}).finally(async () => {
    await prisma.$disconnect();
});
