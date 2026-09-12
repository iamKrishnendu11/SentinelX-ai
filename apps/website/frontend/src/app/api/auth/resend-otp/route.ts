import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      );
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/resend-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        return NextResponse.json(
          {
            success: false,
            message: data.message || data.error || 'Failed to resend code',
            ...data,
          },
          { status: response.status }
        );
      }

      return NextResponse.json(data, { status: response.status });
    } catch (err) {
      console.error('Backend connection error:', err);
      return NextResponse.json(
        { success: false, message: 'Could not connect to backend server.' },
        { status: 503 }
      );
    }
  } catch (error: unknown) {
    console.error('Resend OTP route error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
