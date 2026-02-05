import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from './db.js';

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'fallback-secret-change-in-production';

// User registration
async function registerUser(userData) {
  const { email, username, password, firstName, lastName } = userData;
  
  try {
    // Check if user already exists
    const existingUser = await query(
      'SELECT id FROM users WHERE email = $1 OR username = $2',
      [email, username]
    );
    
    if (existingUser.rows.length > 0) {
      throw new Error('User with this email or username already exists');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user
    const result = await query(
      `INSERT INTO users (email, username, password_hash, first_name, last_name)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, email, username, first_name, last_name, created_at`,
      [email, username, passwordHash, firstName, lastName]
    );

    // Initialize user streaks
    await query(
      'INSERT INTO user_streaks (user_id) VALUES ($1)',
      [result.rows[0].id]
    );

    return result.rows[0];
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
}

// User login
async function loginUser(email, password) {
  try {
    // Find user by email
    const result = await query(
      'SELECT id, email, username, password_hash, first_name, last_name FROM users WHERE email = $1 AND is_active = true',
      [email]
    );

    if (result.rows.length === 0) {
      throw new Error('Invalid credentials');
    }

    const user = result.rows[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    // Update last active
    await query(
      'UPDATE users SET last_active = CURRENT_TIMESTAMP WHERE id = $1',
      [user.id]
    );

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Remove password hash from user object
    delete user.password_hash;

    return { user, token };
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

// Verify JWT token
async function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Check if user still exists and is active
    const result = await query(
      'SELECT id, email, username, first_name, last_name FROM users WHERE id = $1 AND is_active = true',
      [decoded.userId]
    );

    if (result.rows.length === 0) {
      throw new Error('User not found or inactive');
    }

    return result.rows[0];
  } catch (error) {
    console.error('Token verification error:', error);
    throw new Error('Invalid token');
  }
}

// Get user by ID
async function getUserById(userId) {
  try {
    const result = await query(
      'SELECT id, email, username, first_name, last_name, avatar_url, preferences, created_at, last_active FROM users WHERE id = $1 AND is_active = true',
      [userId]
    );

    return result.rows[0] || null;
  } catch (error) {
    console.error('Get user error:', error);
    throw error;
  }
}

// Update user preferences
async function updateUserPreferences(userId, preferences) {
  try {
    const result = await query(
      'UPDATE users SET preferences = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING preferences',
      [JSON.stringify(preferences), userId]
    );

    return result.rows[0].preferences;
  } catch (error) {
    console.error('Update preferences error:', error);
    throw error;
  }
}

// Change password
async function changePassword(userId, currentPassword, newPassword) {
  try {
    // Get current password hash
    const result = await query(
      'SELECT password_hash FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      throw new Error('User not found');
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, result.rows[0].password_hash);
    if (!isValidPassword) {
      throw new Error('Current password is incorrect');
    }

    // Hash new password
    const newPasswordHash = await bcrypt.hash(newPassword, 12);

    // Update password
    await query(
      'UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [newPasswordHash, userId]
    );

    return true;
  } catch (error) {
    console.error('Change password error:', error);
    throw error;
  }
}

// Middleware to protect API routes
function withAuth(handler) {
  return async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Authorization token required' });
      }

      const token = authHeader.substring(7);
      const user = await verifyToken(token);
      
      // Attach user to request object
      req.user = user;
      
      return handler(req, res);
    } catch (error) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
  };
}

export {
  registerUser,
  loginUser,
  verifyToken,
  getUserById,
  updateUserPreferences,
  changePassword,
  withAuth
};
