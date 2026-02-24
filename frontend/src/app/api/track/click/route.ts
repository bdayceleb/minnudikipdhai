import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const source = searchParams.get('source') || 'unknown';
        const redirectUrl = searchParams.get('url') || '/';

        // Log the link click event
        await prisma.trackingEvent.create({
            data: {
                event_type: 'LINK_CLICK',
                source: source,
            }
        });

        // Ensure we only redirect to relative paths or the actual frontend URL for security
        let finalRedirectUrl = redirectUrl;
        const frontendUrl = process.env.FRONTEND_URL || 'https://motu-ki-pdhai.netlify.app';

        if (redirectUrl.startsWith('http') && !redirectUrl.startsWith(frontendUrl)) {
            // If they try to redirect to some external phishing site, redirect them to home instead
            finalRedirectUrl = '/';
        }

        return NextResponse.redirect(new URL(finalRedirectUrl, req.url));
    } catch (error) {
        console.error('Click tracking error:', error);
        // Fallback gracefully
        return NextResponse.redirect(new URL('/', req.url));
    }
}
