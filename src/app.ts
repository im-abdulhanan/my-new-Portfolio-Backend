import compression from 'compression';
import cors from 'cors';
import express, { Express, Request, Response } from 'express';
import helmet from 'helmet';
import { env } from './config/env.js';
import { errorHandler } from './middleware/error.js';
import { globalLimiter } from './middleware/rateLimiter.js';
import { requestIdMiddleware } from './middleware/requestId.js';
import { contactRouter } from './routes/contact.routes.js';
import { healthRouter } from './routes/health.routes.js';

const app: Express = express();

// Trust reverse proxy (Render, Railway, Nginx, Vercel)
app.set('trust proxy', 1);

// Disable X-Powered-By header
app.disable('x-powered-by');

// Security Headers via Helmet
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:'],
      },
    },
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    crossOriginOpenerPolicy: { policy: 'same-origin' },
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  }),
);

// Response compression
app.use(compression());

// Request ID tracking
app.use(requestIdMiddleware);

// CORS configuration
const allowedOrigins = [env.CLIENT_URL, `${env.CLIENT_URL}/`];
if (env.NODE_ENV === 'development') {
  allowedOrigins.push(
    'http://localhost:3000',
    'http://localhost:3000/',
    'http://localhost:5173',
    'http://localhost:5173/',
  );
}

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) {
        callback(null, true);
        return;
      }
      const normalizedOrigin = origin.replace(/\/+$/, '');
      if (allowedOrigins.includes(origin) || allowedOrigins.includes(normalizedOrigin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS error: Origin ${origin} not allowed`));
      }
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
    credentials: true,
  }),
);

// Rate Limiting
app.use(globalLimiter);

// Body Parsing
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// API Routes
app.use('/health', healthRouter);
app.use('/api/contact', contactRouter);

// 404 Route Handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found.',
  });
});

// Central Error Handler
app.use(errorHandler);

export { app };
