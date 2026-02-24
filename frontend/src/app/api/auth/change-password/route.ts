import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { getAuthUser } from '../../../../lib/auth';

export async function POST(req: NextRequest) {
    try {
        const authUser = await getAuthUser(req);
        const { currentPassword, newPassword } = await req.json();

        if (!currentPassword || !newPassword) {
            return NextResponse.json({ error: 'Current password and new password are required' }, { status: 400 });
        }

        if (newPassword.length < 3) {
            return NextResponse.json({ error: 'New password must be at least 3 characters' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({ where: { id: authUser.userId } });
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        if (currentPassword !== user.password) {
            return NextResponse.json({ error: 'Current password is incorrect' }, { status: 401 });
        }

        await prisma.user.update({
            where: { id: authUser.userId },
            data: { password: newPassword }
        });

        return NextResponse.json({ message: 'Password changed successfully' });
    } catch (error) {
        console.error('Change password error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
