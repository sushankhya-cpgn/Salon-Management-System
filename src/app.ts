
import express from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';
import swaggerUI from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';
const app = express();
app.use(cors());
app.use(express.json());


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
  apis: ['./routes/*.js'], // Path to the API routes files
};

const specs = swaggerJsDoc(options);


app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs));

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});


export default app;