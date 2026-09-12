import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        return NextResponse.json(
          {
            success: false,
            message: data.message || data.error || 'Failed to create account',
            ...data,
          },
          { status: response.status }
        );
      }

      return NextResponse.json(data, { status: response.status });
    } catch (err) {
      console.error('Backend connection error:', err);
      return NextResponse.json(
        {
          success: false,
          message: 'Could not connect to backend server. Make sure the Java backend (port 8080) is running.',
        },
        { status: 503 }
      );
    }
  } catch (error: unknown) {
    console.error('Signup route error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
