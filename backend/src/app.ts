import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { config } from './config/env';
import routes from './routes';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';
import {
  helmetConfig,
  getCorsOptions,
  sanitizeData,
  preventParamPollution,
  requestSizeLimiter,
  securityHeaders,
  sanitizeInput,
  apiRateLimiter,
  configureTrustedProxy,
} from './middleware/security.middleware';

const app = express();

// Configure trusted proxy
configureTrustedProxy(app);

// Security headers
app.use(helmetConfig);
app.use(securityHeaders);

// CORS configuration
app.use(cors(getCorsOptions()));

// Logging
app.use(morgan(config.NODE_ENV === 'development' ? 'dev' : 'combined'));

// Request size limiter
app.use(requestSizeLimiter);

// Body parsing with limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Data sanitization
app.use(sanitizeData);
app.use(sanitizeInput);
app.use(preventParamPollution);

// Global rate limiting for API routes
app.use('/api', apiRateLimiter);

// Health check endpoint (direct, not through routes)
app.get('/health', (_req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Routes
app.use('/api', routes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
