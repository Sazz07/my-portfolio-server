import express, { Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import routes from './app/routes';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import { configureStaticFiles } from './app/middlewares/static';

const app = express();

app.use(
  cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure static file serving
configureStaticFiles(app);

// Application routes
app.use('/api/v1', routes);

// Test route
app.get('/', (req: Request, res: Response) => {
  res.send('Portfolio Server Running 🚀');
});

// Global error handler
app.use(globalErrorHandler);

export default app;
