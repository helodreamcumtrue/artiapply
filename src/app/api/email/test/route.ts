import { NextRequest, NextResponse } from 'next/server';
import { dispatchRealEmail, verifySmtpConnection, getActiveSmtpConfig } from '@/lib/email/dispatcher';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { to, subject = 'ArticlO Test Email', message, smtpConfig } = body;

    if (!to) {
      return NextResponse.json(
        { error: 'Recipient email ("to") is required.' },
        { status: 400 }
      );
    }

    const testHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; rounded: 12px;">
        <h2 style="color: #0f172a; margin-top: 0;">ArticlO Email Delivery Test</h2>
        <p style="color: #334155; font-size: 14px; line-height: 1.6;">
          ${message || 'This is a live test email sent from your ArticlO cold email platform.'}
        </p>
        <div style="margin-top: 20px; padding: 12px; background: #f8fafc; border-radius: 8px; font-size: 12px; color: #64748b;">
          <strong>Sent At:</strong> ${new Date().toISOString()}<br/>
          <strong>Platform:</strong> ArticlO Article & Cold Email Engine
        </div>
      </div>
    `;

    const result = await dispatchRealEmail({
      to,
      subject,
      htmlBody: testHtml,
      smtpConfig,
    });

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
          provider: result.provider,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      messageId: result.messageId,
      provider: result.provider,
      message: `Test email sent successfully to ${to}! Check your inbox.`,
    });
  } catch (error: any) {
    console.error('[API /api/email/test] Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to dispatch test email' },
      { status: 500 }
    );
  }
}
