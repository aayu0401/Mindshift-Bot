import { NextResponse } from 'next/server';
import { verifyToken } from './auth.js';

// Middleware to protect API routes
export function withAuth(handler) {
  return async (req, context) => {
    try {
      const authHeader = req.headers.get('authorization');
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json(
          { error: 'Authorization token required' },
          { status: 401 }
        );
      }

      const token = authHeader.substring(7);
      const user = await verifyToken(token);
      
      // Attach user to request object
      req.user = user;
      
      return handler(req, context);
    } catch (error) {
      console.error('Auth middleware error:', error);
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }
  };
}

// Optional auth middleware (allows anonymous access)
export function withOptionalAuth(handler) {
  return async (req, context) => {
    try {
      const authHeader = req.headers.get('authorization');
      
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        const user = await verifyToken(token);
        req.user = user;
      }
      
      // Continue without auth if no token or invalid token
      return handler(req, context);
    } catch (error) {
      // Continue as anonymous if token is invalid
      console.log('Invalid token, continuing as anonymous');
      return handler(req, context);
    }
  };
}

// Rate limiting middleware
const rateLimitMap = new Map();

export function withRateLimit(maxRequests = 100, windowMs = 60000) {
  return function(handler) {
    return async (req, context) => {
      const clientIP = req.ip || req.headers.get('x-forwarded-for') || 'unknown';
      const key = `${clientIP}:${req.url}`;
      
      const now = Date.now();
      const windowStart = now - windowMs;
      
      // Clean old entries
      for (const [ipKey, requests] of rateLimitMap.entries()) {
        const validRequests = requests.filter(timestamp => timestamp > windowStart);
        if (validRequests.length === 0) {
          rateLimitMap.delete(ipKey);
        } else {
          rateLimitMap.set(ipKey, validRequests);
        }
      }
      
      // Check current IP
      const requests = rateLimitMap.get(key) || [];
      
      if (requests.length >= maxRequests) {
        return NextResponse.json(
          { error: 'Too many requests. Please try again later.' },
          { status: 429 }
        );
      }
      
      // Add current request
      requests.push(now);
      rateLimitMap.set(key, requests);
      
      return handler(req, context);
    };
  };
}

// Error handling middleware
export function withErrorHandler(handler) {
  return async (req, context) => {
    try {
      return await handler(req, context);
    } catch (error) {
      console.error('API Error:', error);
      
      // Don't expose internal error details in production
      const isDevelopment = process.env.NODE_ENV === 'development';
      
      return NextResponse.json(
        {
          error: isDevelopment ? error.message : 'Internal Server Error',
          ...(isDevelopment && { stack: error.stack })
        },
        { status: 500 }
      );
    }
  };
}

// Request logging middleware
export function withLogging(handler) {
  return async (req, context) => {
    const start = Date.now();
    const method = req.method;
    const url = req.url;
    const userAgent = req.headers.get('user-agent') || 'unknown';
    
    console.log(`[${new Date().toISOString()}] ${method} ${url} - ${userAgent}`);
    
    try {
      const response = await handler(req, context);
      const duration = Date.now() - start;
      
      console.log(`[${new Date().toISOString()}] ${method} ${url} - ${response.status} - ${duration}ms`);
      
      return response;
    } catch (error) {
      const duration = Date.now() - start;
      console.error(`[${new Date().toISOString()}] ${method} ${url} - ERROR - ${duration}ms - ${error.message}`);
      
      throw error;
    }
  };
}

// CORS middleware
export function withCors(handler) {
  return async (req, context) => {
    const response = await handler(req, context);
    
    // Add CORS headers
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    return response;
  };
}

// Combine multiple middleware
export function compose(...middlewares) {
  return function(handler) {
    return middlewares.reduceRight(
      (acc, middleware) => middleware(acc),
      handler
    );
  };
}
