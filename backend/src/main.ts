process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; 

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Enable CORS - This allows your frontend to talk to the backend
  app.enableCors({
    // I switched from 'true' because some browsers/proxies strip it in production.
    origin: [
      'http://localhost:3000',      // Allows Frontend devs working locally
      'http://127.0.0.1:3000',      // Safety net: some systems use IP instead of "localhost"
      'https://pos-inventory-system-r7w8.onrender.com', // Allows the backend to talk to itself (for health checks dont worry)
      // FUTURE TODO: Add the deployed frontend url here
    ], 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // 2. Set Global Prefix
  app.setGlobalPrefix('api/v1'); 

  // 3. Set Global Pipes
  app.useGlobalPipes(new ValidationPipe({ 
    whitelist: true, 
    transform: true,
    forbidNonWhitelisted: true,
  }));

  // 4. Start the server
  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0'); // we bind to 0.0.0.0 instead of local host to allows us listen on all network interfaces
  //dont worry you still have the default port 3k

  const url = await app.getUrl();//get the url we need should work with ports to
  console.log(`🚀 Application is running on: ${url}`);
  console.log(`🌍 Production URL: ${process.env.RENDER_EXTERNAL_URL || 'This is Local Dev Enviroment'}`);// dont mind my slight change of fancy
}
bootstrap();