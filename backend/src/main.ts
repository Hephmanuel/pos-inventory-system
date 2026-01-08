process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; 

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Enable CORS - This allows your frontend to talk to the backend
  app.enableCors({
    origin: true, // This automatically reflects the origin of the request (perfect for dev)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // 2. Set Global Prefix
  app.setGlobalPrefix('api/v1'); 

  // 3. Set Global Pipes
  app.useGlobalPipes(new ValidationPipe({ 
    whitelist: true, 
    transform: true,
    forbidNonWhitelisted: true, // Extra security: rejects fields not in the DTO
  }));

  // 4. Start the server
  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  console.log(`🚀 Application is running on: http://localhost:${port}/api/v1`);
  console.log(`🌍 Production URL: ${process.env.RENDER_EXTERNAL_URL || 'Not Deployed'}`);
}
bootstrap();