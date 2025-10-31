import { Request, Response, NextFunction } from 'express';

/**
 * Monitoring Middleware
 *
 * Detects and logs potential issues:
 * - Slow requests (potential infinite loops)
 * - High memory usage (potential memory leaks)
 * - Validation errors (potential contract mismatches)
 * - Database contention (potential race conditions)
 */

interface RequestMetrics {
  startTime: number;
  startMemory: number;
  path: string;
  method: string;
}

// Store active requests
const activeRequests = new Map<string, RequestMetrics>();

/**
 * Request timing and performance monitoring
 */
export const requestMonitoring = (req: Request, res: Response, next: NextFunction) => {
  const requestId = `${Date.now()}-${Math.random()}`;
  const startTime = Date.now();
  const startMemory = process.memoryUsage().heapUsed;

  // Store request metrics
  activeRequests.set(requestId, {
    startTime,
    startMemory,
    path: req.path,
    method: req.method,
  });

  // Monitor response
  res.on('finish', () => {
    const metrics = activeRequests.get(requestId);
    if (!metrics) return;

    const duration = Date.now() - metrics.startTime;
    const memoryDelta = process.memoryUsage().heapUsed - metrics.startMemory;

    // Log slow requests (potential infinite loops or performance issues)
    if (duration > 5000) { // 5 seconds
      console.warn('⚠️  SLOW REQUEST DETECTED', {
        path: req.path,
        method: req.method,
        duration: `${duration}ms`,
        statusCode: res.statusCode,
        timestamp: new Date().toISOString(),
      });

      // If extremely slow, might be infinite loop
      if (duration > 30000) { // 30 seconds
        console.error('🚨 CRITICAL: Extremely slow request - possible infinite loop!', {
          path: req.path,
          method: req.method,
          duration: `${duration}ms`,
          statusCode: res.statusCode,
        });
      }
    }

    // Log high memory usage requests (potential memory leaks)
    if (memoryDelta > 50 * 1024 * 1024) { // 50MB
      console.warn('⚠️  HIGH MEMORY USAGE', {
        path: req.path,
        method: req.method,
        memoryDelta: `${Math.round(memoryDelta / 1024 / 1024)}MB`,
        duration: `${duration}ms`,
      });
    }

    // Log performance metrics for specific endpoints
    if (req.path.includes('/appointments') && req.method === 'POST') {
      console.info('📊 Appointment Creation Metrics', {
        duration: `${duration}ms`,
        statusCode: res.statusCode,
        success: res.statusCode === 201,
      });

      // Slow appointment creation might indicate contention
      if (duration > 3000) {
        console.warn('⚠️  Slow appointment creation - possible database contention', {
          duration: `${duration}ms`,
        });
      }
    }

    activeRequests.delete(requestId);
  });

  next();
};

/**
 * Memory monitoring
 */
export const memoryMonitoring = () => {
  // Check memory every minute
  setInterval(() => {
    const memUsage = process.memoryUsage();
    const heapUsedMB = Math.round(memUsage.heapUsed / 1024 / 1024);
    const heapTotalMB = Math.round(memUsage.heapTotal / 1024 / 1024);

    // Log if memory usage is high
    if (heapUsedMB > 500) { // 500MB
      console.warn('⚠️  HIGH MEMORY USAGE', {
        heapUsed: `${heapUsedMB}MB`,
        heapTotal: `${heapTotalMB}MB`,
        percentage: `${Math.round((memUsage.heapUsed / memUsage.heapTotal) * 100)}%`,
      });
    }

    // Critical memory usage
    if (heapUsedMB > 1000) { // 1GB
      console.error('🚨 CRITICAL MEMORY USAGE - Possible memory leak!', {
        heapUsed: `${heapUsedMB}MB`,
        heapTotal: `${heapTotalMB}MB`,
        activeRequests: activeRequests.size,
      });
    }

    // Log memory stats periodically
    if (process.env.NODE_ENV === 'development') {
      console.log('💾 Memory Stats', {
        heapUsed: `${heapUsedMB}MB`,
        heapTotal: `${heapTotalMB}MB`,
        rss: `${Math.round(memUsage.rss / 1024 / 1024)}MB`,
        activeRequests: activeRequests.size,
      });
    }
  }, 60000); // Every minute
};

/**
 * Validation error tracking (Bug #1 prevention)
 */
export const validationErrorTracking = (req: Request, res: Response, next: NextFunction) => {
  // Intercept validation errors
  const originalJson = res.json.bind(res);

  res.json = function (body: any) {
    // Check if this is a validation error
    if (
      res.statusCode === 400 &&
      body.message === 'Validation failed' &&
      Array.isArray(body.errors)
    ) {
      console.warn('⚠️  VALIDATION ERROR (Possible Contract Mismatch)', {
        path: req.path,
        method: req.method,
        body: req.body,
        errors: body.errors,
        timestamp: new Date().toISOString(),
      });

      // Check for specific patterns that indicate Bug #1 scenario
      const hasFieldMismatch = body.errors.some((err: any) =>
        err.field?.includes('username') ||
        err.field?.includes('emailOrUsername') ||
        err.message?.includes('required')
      );

      if (hasFieldMismatch) {
        console.error('🚨 POTENTIAL BUG #1: Auth field name mismatch detected!', {
          path: req.path,
          errors: body.errors,
          requestBody: req.body,
        });
      }
    }

    return originalJson(body);
  };

  next();
};

/**
 * Database transaction monitoring (Bug #4 prevention)
 */
export const transactionMonitoring = () => {
  // This would integrate with Prisma's query logging
  // For now, we log transaction durations

  const transactionTimes = new Map<string, number>();

  return {
    start(transactionId: string) {
      transactionTimes.set(transactionId, Date.now());
    },

    end(transactionId: string, success: boolean) {
      const startTime = transactionTimes.get(transactionId);
      if (!startTime) return;

      const duration = Date.now() - startTime;

      // Log slow transactions
      if (duration > 5000) {
        console.warn('⚠️  SLOW TRANSACTION', {
          transactionId,
          duration: `${duration}ms`,
          success,
        });
      }

      // Critical transaction time might indicate deadlock or contention
      if (duration > 10000) {
        console.error('🚨 CRITICAL: Very slow transaction - possible deadlock!', {
          transactionId,
          duration: `${duration}ms`,
          success,
        });
      }

      transactionTimes.delete(transactionId);
    },
  };
};

/**
 * Error pattern detection
 */
export const errorPatternDetection = () => {
  const errorCounts = new Map<string, number>();
  const errorWindow = 5 * 60 * 1000; // 5 minutes

  return (error: Error, context?: any) => {
    const errorKey = `${error.name}:${error.message.substring(0, 50)}`;

    // Increment error count
    const currentCount = errorCounts.get(errorKey) || 0;
    errorCounts.set(errorKey, currentCount + 1);

    // Clear old counts after window
    setTimeout(() => {
      errorCounts.delete(errorKey);
    }, errorWindow);

    // Alert if error occurs frequently
    if (currentCount > 10) {
      console.error('🚨 HIGH ERROR FREQUENCY DETECTED', {
        error: errorKey,
        count: currentCount,
        timeWindow: '5 minutes',
        context,
      });
    }

    // Detect specific bug patterns
    if (error.message.includes('Maximum call stack') || error.message.includes('infinite')) {
      console.error('🚨 INFINITE LOOP DETECTED!', {
        error: error.message,
        stack: error.stack,
        context,
      });
    }

    if (error.message.includes('timeout') || error.message.includes('ETIMEDOUT')) {
      console.error('🚨 TIMEOUT DETECTED', {
        error: error.message,
        context,
      });
    }

    if (error.message.includes('deadlock') || error.message.includes('contention')) {
      console.error('🚨 DATABASE CONTENTION DETECTED (Possible Bug #4)', {
        error: error.message,
        context,
      });
    }
  };
};

/**
 * Initialize all monitoring
 */
export const initializeMonitoring = () => {
  console.log('🔍 Initializing monitoring middleware...');

  // Start memory monitoring
  memoryMonitoring();

  // Initialize transaction monitoring
  const txMonitor = transactionMonitoring();

  // Initialize error detection
  const errorDetector = errorPatternDetection();

  console.log('✅ Monitoring initialized');

  return {
    txMonitor,
    errorDetector,
  };
};
