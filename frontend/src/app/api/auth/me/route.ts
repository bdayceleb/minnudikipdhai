import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { getAuthUser } from '../../../../lib/auth';

export async function GET(req: NextRequest) {
    try {
        const authUser = await getAuthUser(req);

        const user = await prisma.user.findUnique({
            where: { id: authUser.userId },
            select: { id: true, name: true, username: true, role: true }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
}
