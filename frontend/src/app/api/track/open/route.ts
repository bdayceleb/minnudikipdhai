import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const source = searchParams.get('source') || 'unknown';

        // Log the email open event
        await prisma.trackingEvent.create({
            data: {
                event_type: 'EMAIL_OPEN',
                source: source,
            }
        });

        // Return a transparent 1x1 pixel image
        const transparentPixelBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
        const buffer = Buffer.from(transparentPixelBase64, 'base64');

        return new NextResponse(buffer, {
            status: 200,
            headers: {
                'Content-Type': 'image/png',
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0',
            }
        });
    } catch (error) {
        console.error('Email open tracking error:', error);
        // Even if tracking fails, return a 200 empty response so the email client doesn't show a broken image box
        return new NextResponse("", { status: 200, headers: { 'Content-Type': 'image/png' } });
    }
}
