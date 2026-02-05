import { NextResponse } from 'next/server';
import { loginUser } from '@/lib/auth.js';
import { initializeDatabase } from '@/lib/db.js';

export async function POST(req) {
  try {
    // Ensure database is initialized
    await initializeDatabase();

    const body = await req.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Login user
    const { user, token } = await loginUser(email, password);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.first_name,
        lastName: user.last_name,
        createdAt: user.created_at
      },
      token,
      message: 'Login successful'
    });

  } catch (error) {
    console.error('[Login API Error]:', error);
    
    if (error.message.includes('Invalid credentials')) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Login failed. Please try again.' },
      { status: 500 }
    );
  }
}
