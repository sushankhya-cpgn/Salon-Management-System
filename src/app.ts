
import express from 'express';
import type { Request, Response } from 'express';
import authRoutes from "./routes/authRoutes.js"
import appointmentRoutes from './routes/appointmentRoutes.js'
import slotRoutes from './routes/slotRoutes.js'
import cors from 'cors';
import swaggerUI from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';
import { rateLimit } from 'express-rate-limit';
import { fileURLToPath } from "url";
import path from "path";
import { authenticateUser } from './middleware/auth.js';
import morganMiddleware from './middleware/morganMiddleware.js';
import { requestLoggingMiddleware, errorLoggingMiddleware } from './middleware/loggingMiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();
app.use(cors());  
app.use(express.json());

// Logging middleware
app.use(morganMiddleware);
app.use(requestLoggingMiddleware);


// Rate Limiter Middleware
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	ipv6Subnet: 56, // Set to 60 or 64 to be less aggressive, or 52 or 48 to be more aggressive
	// store: ... , // Redis, Memcached, etc. See below.
})

app.use(limiter)


const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Salon Management System API',
      version: '1.0.0',
      description: 'Comprehensive API documentation for the Salon Management System. This API handles user authentication, appointment management, and available slot queries.',
      license: {
        name: 'MIT',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
      {
        url: 'https://api.salon.example.com',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT Bearer token for authenticated endpoints',
        },
      },
    },
  },
  apis: [path.join(__dirname, './routes/*.{ts,js}')],
};

const specs = swaggerJsDoc(options);

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs));

app.use('/api/users', authRoutes);
app.use('/api/appointment',authenticateUser,appointmentRoutes);
app.use("/api/slots",authenticateUser,slotRoutes)

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

// Error logging middleware (must be at the end)
app.use(errorLoggingMiddleware);

export default app;