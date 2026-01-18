
import express from 'express';
import cors from 'cors';
import swaggerUI from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';
import authRoutes from "./routes/authRoutes.js"
import { rateLimit } from 'express-rate-limit';
import appointmentRoutes from './routes/appointmentRoutes.js'
import type { Request, Response } from 'express';



const app = express();
app.use(cors());  
app.use(express.json());


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
      title: 'Express API Documentation with Swagger',
      version: '1.0.0',
      description: 'Salon Management System API documentation',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
  },
  apis: ['./routes/*.{ts,js}'], // Path to the API routes files
};

const specs = swaggerJsDoc(options);

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs));

app.use('/api/users', authRoutes);
app.use('/api',appointmentRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});



export default app;