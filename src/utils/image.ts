import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

// Use NODE_ENV to determine upload directories
const isProduction = process.env.NODE_ENV === 'production';
const UPLOAD_DIR = isProduction
  ? '/tmp/uploads'
  : path.join(process.cwd(), 'uploads');

const BLOG_IMAGES_DIR = isProduction
  ? '/tmp/uploads/blog-images'
  : path.join(UPLOAD_DIR, 'blog-images');

// Create directories if they don't exist
[UPLOAD_DIR, BLOG_IMAGES_DIR].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

interface ImageConfig {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'jpeg' | 'png' | 'webp';
}

interface OptimizedImage {
  filename: string;
  path: string;
  url: string;
}

export const optimizeImage = async (
  buffer: Buffer,
  config: ImageConfig = {}
): Promise<OptimizedImage> => {
  const { width = 1200, height = 800, quality = 80, format = 'webp' } = config;

  // Generate unique filename
  const filename = `${uuidv4()}.${format}`;
  const filePath = path.join(BLOG_IMAGES_DIR, filename);

  // Process image
  await sharp(buffer)
    .resize(width, height, {
      fit: 'cover',
      position: 'center',
    })
    [format]({
      quality: quality,
    })
    .toFile(filePath);

  // Return file info
  return {
    filename,
    path: filePath,
    url: `/uploads/blog-images/${filename}`,
  };
};

export const deleteImage = async (filename: string): Promise<void> => {
  const filePath = path.join(BLOG_IMAGES_DIR, filename);
  if (fs.existsSync(filePath)) {
    await fs.promises.unlink(filePath);
  }
};

export const extractFilenameFromUrl = (url: string): string => {
  return path.basename(url);
};
