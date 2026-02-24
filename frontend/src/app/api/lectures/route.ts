import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';
import { getAuthUser } from '../../../lib/auth';

// GET /api/lectures — List all lectures
export async function GET(req: NextRequest) {
    try {
        const authUser = await getAuthUser(req);
        const filter = authUser.role === 'ADMIN' ? {} : { is_published: true };

        const lectures = await prisma.lecture.findMany({
            where: filter,
            orderBy: { created_at: 'asc' },
            select: {
                id: true,
                title: true,
                description: true,
                is_published: true,
                created_at: true,
                updated_at: true,
            }
        });

        return NextResponse.json(lectures);
    } catch (error) {
        console.error('Get lectures error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// POST /api/lectures — Create a new lecture
export async function POST(req: NextRequest) {
    try {
        const authUser = await getAuthUser(req);
        if (authUser.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const { title, description, content, is_published } = await req.json();

        if (!title || !content) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const lecture = await prisma.lecture.create({
            data: {
                title,
                description,
                content,
                is_published: is_published || false,
                created_by: authUser.userId
            }
        });

        return NextResponse.json(lecture, { status: 201 });
    } catch (error) {
        console.error('Create lecture error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
