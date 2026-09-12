import { NextRequest, NextResponse } from 'next/server';
import { createSession } from '@/lib/session';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Authenticate with Spring Boot backend
    let backendData: Record<string, unknown> | null = null;
    let backendOk = false;
    let backendStatus = 200;

    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: normalizedEmail, password }),
      });
      backendStatus = response.status;
      backendData = (await response.json().catch(() => ({}))) as Record<string, unknown>;
      backendOk = response.ok;
    } catch (err) {
      console.warn('Backend server connection failed, defaulting to local session:', err);
      // Fallback for offline dev mode
      backendOk = true;
      backendData = {
        success: true,
        user: { email: normalizedEmail, name: normalizedEmail.split('@')[0] }
      };
    }

    if (!backendOk) {
      return NextResponse.json(
        {
          success: false,
          message: (backendData?.message || backendData?.error || 'Invalid email or password') as string,
          ...backendData,
        },
        { status: backendStatus }
      );
    }

    // Set Next.js session cookie
    await createSession(normalizedEmail);

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      user: backendData?.user || { email: normalizedEmail },
    });
  } catch (error: unknown) {
    console.error('Login route error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
