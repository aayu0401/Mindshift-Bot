// Simple logging utility for production

const logLevels = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3
};

const currentLogLevel = logLevels[process.env.LOG_LEVEL?.toUpperCase()] || logLevels.INFO;

function log(level, message, meta = {}) {
  if (logLevels[level] > currentLogLevel) return;
  
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    level,
    message,
    ...meta
  };
  
  // In production, you might want to send logs to a service like Sentry, LogRocket, etc.
  if (process.env.NODE_ENV === 'production') {
    // Send to external logging service
    console.log(JSON.stringify(logEntry));
  } else {
    // Development logging with colors
    const colors = {
      ERROR: '\x1b[31m', // Red
      WARN: '\x1b[33m',  // Yellow
      INFO: '\x1b[36m',  // Cyan
      DEBUG: '\x1b[37m', // White
      RESET: '\x1b[0m'
    };
    
    console.log(`${colors[level]}[${timestamp}] ${level}: ${message}${colors.RESET}`);
    if (Object.keys(meta).length > 0) {
      console.log(meta);
    }
  }
}

export const logger = {
  error: (message, meta) => log('ERROR', message, meta),
  warn: (message, meta) => log('WARN', message, meta),
  info: (message, meta) => log('INFO', message, meta),
  debug: (message, meta) => log('DEBUG', message, meta)
};

// API request logger
export function logApiRequest(req, res, duration) {
  logger.info('API Request', {
    method: req.method,
    url: req.url,
    status: res.status,
    duration: `${duration}ms`,
    userAgent: req.headers.get('user-agent'),
    ip: req.ip || req.headers.get('x-forwarded-for')
  });
}

// Database query logger
export function logDatabaseQuery(query, params, duration) {
  logger.debug('Database Query', {
    query: query.substring(0, 100) + (query.length > 100 ? '...' : ''),
    paramCount: params?.length || 0,
    duration: `${duration}ms`
  });
}

// Error logger for unhandled exceptions
export function logError(error, context = {}) {
  logger.error('Unhandled Error', {
    message: error.message,
    stack: error.stack,
    ...context
  });
}
