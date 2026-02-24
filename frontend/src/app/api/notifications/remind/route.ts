import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '../../../../lib/auth';
import { Resend } from 'resend';
import twilio from 'twilio';

export async function POST(req: NextRequest) {
    try {
        const authUser = await getAuthUser(req);
        if (authUser.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const { message, type } = await req.json(); // type: 'email' | 'whatsapp' | 'both'

        let emailSent = false;
        let whatsappSent = false;
        let errors = [];

        // 1. Send Email via Resend
        if (type === 'email' || type === 'both') {
            const resendApiKey = process.env.RESEND_API_KEY;

            if (!resendApiKey) {
                errors.push('RESEND_API_KEY is not configured');
            } else {
                try {
                    const resend = new Resend(resendApiKey);
                    await resend.emails.send({
                        from: 'Admin <onboarding@resend.dev>', // Default resend dev email
                        to: 'onboarding@resend.dev', // You should change this to Minni's email in production or use your verified domain
                        subject: 'Time to study on Motu Ki Pdhai! 📚',
                        html: `
                            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
                                <h1 style="color: #10b981;">Hi Minni! 👋</h1>
                                <p style="font-size: 16px; color: #334155;">${message || 'It is time for your daily study session. Log in now and let us crush those goals together!'}</p>
                                <div style="margin-top: 30px;">
                                    <a href="${process.env.FRONTEND_URL || 'https://motu-ki-pdhai.netlify.app'}" style="background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">Open Dashboard</a>
                                </div>
                            </div>
                        `
                    });
                    emailSent = true;
                } catch (e: any) {
                    console.error('Email error:', e);
                    errors.push(`Email failed: ${e.message}`);
                }
            }
        }

        // 2. Send WhatsApp via Twilio
        if (type === 'whatsapp' || type === 'both') {
            const accountSid = process.env.TWILIO_ACCOUNT_SID;
            const authToken = process.env.TWILIO_AUTH_TOKEN;
            const fromNumber = process.env.TWILIO_WHATSAPP_FROM; // e.g. whatsapp:+14155238886
            const toNumber = process.env.TWILIO_WHATSAPP_TO; // e.g. whatsapp:+919876543210

            if (!accountSid || !authToken || !fromNumber || !toNumber) {
                errors.push('Twilio credentials are not fully configured');
            } else {
                try {
                    const client = twilio(accountSid, authToken);
                    await client.messages.create({
                        body: `*Motu Ki Pdhai Update* 📚\n\nHi Minni,\n${message || 'Time to study! Open your dashboard to get started.'}`,
                        from: fromNumber,
                        to: toNumber
                    });
                    whatsappSent = true;
                } catch (e: any) {
                    console.error('WhatsApp error:', e);
                    errors.push(`WhatsApp failed: ${e.message}`);
                }
            }
        }

        return NextResponse.json({
            success: true,
            emailSent,
            whatsappSent,
            errors: errors.length > 0 ? errors : undefined
        });

    } catch (error) {
        console.error('Notification error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
