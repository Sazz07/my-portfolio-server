import express from 'express';
import path from 'path';

// Configure static file serving
const UPLOAD_DIR = path.join(process.cwd(), 'uploads');

export const configureStaticFiles = (app: express.Application) => {
  // Serve uploaded files
  app.use('/uploads', express.static(UPLOAD_DIR));
};
