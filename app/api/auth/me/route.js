import { NextResponse } from 'next/server';
import { verifyToken, getUserById } from '@/lib/auth.js';
import { initializeDatabase } from '@/lib/db.js';

export async function GET(req) {
  try {
    // Ensure database is initialized
    await initializeDatabase();

    const authHeader = req.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authorization token required' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = await verifyToken(token);
    
    // Get fresh user data
    const user = await getUserById(decoded.id);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.first_name,
        lastName: user.last_name,
        avatarUrl: user.avatar_url,
        preferences: user.preferences,
        createdAt: user.created_at,
        lastActive: user.last_active
      }
    });

  } catch (error) {
    console.error('[Auth Me API Error]:', error);
    
    if (error.message.includes('Invalid token') || error.message.includes('User not found')) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to fetch user data' },
      { status: 500 }
    );
  }
}
