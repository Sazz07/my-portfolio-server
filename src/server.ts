import { Server } from 'http';
import app from './app';
import config from './config';

async function bootstrap() {
  const server: Server = app.listen(config.port, () => {
    console.log(`🚀 Server running on port ${config.port}`);
  });

  const exitHandler = () => {
    if (server) {
      server.close(() => {
        console.log('Server closed');
      });
    }
    process.exit(1);
  };

  process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    exitHandler();
  });

  process.on('unhandledRejection', (error) => {
    console.error('Unhandled Rejection:', error);
    exitHandler();
  });
}

bootstrap();
