import express from 'express';
import path from 'path';

// Use NODE_ENV to determine static upload directory
const isProduction = process.env.NODE_ENV === 'production';
const UPLOAD_DIR = isProduction
  ? '/tmp/uploads'
  : path.join(process.cwd(), 'uploads');

export const configureStaticFiles = (app: express.Application) => {
  // Serve uploaded files (ephemeral in production, persistent in development)
  app.use('/uploads', express.static(UPLOAD_DIR));
};
