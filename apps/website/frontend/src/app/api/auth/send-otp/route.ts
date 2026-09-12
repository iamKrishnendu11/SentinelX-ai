import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { generateOTP, saveOTP } from '@/lib/otpStore';

const resend = new Resend(process.env.RESEND_API_KEY || 're_mock');
const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

function getEmailTemplate(otp: string) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background-color: #050505;
          color: #F5F5F0;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 500px;
          margin: 40px auto;
          background-color: #0A0A0A;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 40px;
          text-align: center;
        }
        .logo-container {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-bottom: 24px;
        }
        .logo-text {
          font-weight: 700;
          font-size: 16px;
          letter-spacing: -0.5px;
          color: #F5F5F0;
        }
        h1 {
          font-size: 24px;
          font-weight: 600;
          margin-bottom: 8px;
          color: #F5F5F0;
        }
        p {
          color: #9CA3AF;
          font-size: 14px;
          line-height: 1.5;
          margin-bottom: 24px;
        }
        .otp-box {
          background-color: #0A0A0A;
          border: 1px solid rgba(183, 255, 0, 0.4);
          border-radius: 16px;
          padding: 32px 24px;
          margin: 32px 0;
          box-shadow: 0 0 24px rgba(183,255,0,0.15), inset 0 0 12px rgba(183,255,0,0.05);
          position: relative;
          overflow: hidden;
        }
        .otp-code {
          font-family: 'JetBrains Mono', monospace;
          font-size: 36px;
          font-weight: 700;
          letter-spacing: 12px;
          color: #B7FF00;
          margin: 0;
          text-align: center;
        }
        .copy-button {
          display: inline-block;
          background-color: #B7FF00;
          color: #050505;
          text-decoration: none;
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 1px;
          padding: 12px 24px;
          border-radius: 9999px;
          margin-top: 16px;
          border: none;
          cursor: pointer;
        }
        .footer {
          margin-top: 32px;
          font-size: 12px;
          color: #6B7280;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo-container">
          <span class="logo-text">SENTINELX AI</span>
        </div>
        <h1>Verify your email</h1>
        <p>Your verification code is</p>
        
        <div class="otp-box">
          <p class="otp-code">${otp}</p>
        </div>

        <a href="#" class="copy-button">COPY OTP</a>
        
        <p>This code expires in 10 minutes.</p>
        <p>If you didn't request this code, you can safely ignore this email.</p>
        
        <div class="footer">
          &copy; ${new Date().getFullYear()} SentinelX AI
        </div>
      </div>
    </body>
    </html>
  `;
}

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    const otp = generateOTP();
    
    try {
      saveOTP(email, otp);
    } catch (e: any) {
      return NextResponse.json({ error: e.message }, { status: 429 });
    }

    // Only attempt to send if RESEND_API_KEY is configured correctly, otherwise log it (for local testing without keys)
    if (process.env.RESEND_API_KEY) {
      const { data, error } = await resend.emails.send({
        from: `SentinelX AI <${fromEmail}>`,
        to: [email],
        subject: 'Your verification code',
        html: getEmailTemplate(otp),
      });

      if (error) {
        console.error('Resend error:', error);
        return NextResponse.json({ error: "We couldn't send the verification code. Please try again." }, { status: 500 });
      }
    } else {
      console.log(`[DEV OTP] for ${email}: ${otp}`);
    }

    return NextResponse.json({ success: true, message: 'OTP sent' });
  } catch (error) {
    console.error('Send OTP error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
