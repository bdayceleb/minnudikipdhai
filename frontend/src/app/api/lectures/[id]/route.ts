import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { getAuthUser } from '../../../../lib/auth';

// GET /api/lectures/[id] — Get a single lecture
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const authUser = await getAuthUser(req);

        const lecture = await prisma.lecture.findUnique({ where: { id } });

        if (!lecture) {
            return NextResponse.json({ error: 'Lecture not found' }, { status: 404 });
        }

        if (authUser.role === 'USER' && !lecture.is_published) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        return NextResponse.json(lecture);
    } catch (error) {
        console.error('Get lecture error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// PUT /api/lectures/[id] — Update a lecture
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const authUser = await getAuthUser(req);
        if (authUser.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const { title, description, content, is_published } = await req.json();

        const lecture = await prisma.lecture.update({
            where: { id },
            data: { title, description, content, is_published }
        });

        return NextResponse.json(lecture);
    } catch (error) {
        console.error('Update lecture error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// DELETE /api/lectures/[id] — Delete a lecture
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const authUser = await getAuthUser(req);
        if (authUser.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        await prisma.lecture.delete({ where: { id } });

        return NextResponse.json({ message: 'Lecture deleted successfully' });
    } catch (error) {
        console.error('Delete lecture error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
