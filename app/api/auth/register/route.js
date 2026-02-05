import { NextResponse } from 'next/server';
import { registerUser } from '@/lib/auth.js';
import { initializeDatabase } from '@/lib/db.js';

export async function POST(req) {
  try {
    // Ensure database is initialized
    await initializeDatabase();

    const body = await req.json();
    const { email, username, password, firstName, lastName } = body;

    // Validate input
    if (!email || !username || !password || !firstName) {
      return NextResponse.json(
        { error: 'Email, username, password, and first name are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // Validate username
    if (username.length < 3 || username.length > 20) {
      return NextResponse.json(
        { error: 'Username must be between 3 and 20 characters' },
        { status: 400 }
      );
    }

    // Register user
    const user = await registerUser({
      email,
      username,
      password,
      firstName,
      lastName: lastName || ''
    });

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
      message: 'Registration successful'
    });

  } catch (error) {
    console.error('[Registration API Error]:', error);
    
    if (error.message.includes('already exists')) {
      return NextResponse.json(
        { error: 'User with this email or username already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Registration failed. Please try again.' },
      { status: 500 }
    );
  }
}
