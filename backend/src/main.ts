require('dotenv').config();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; 

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // DEBUG BLOCK
  const dbUrl = process.env.DATABASE_URL;
  console.log('------------------------------------------------');
  console.log('CONNECTING TO DB:', dbUrl ? dbUrl.split('@')[1] : 'UNDEFINED'); 
  console.log('------------------------------------------------');
  // (We split by '@' to show the host without revealing the password)

  // 1. Enable CORS - This allows your frontend to talk to the backend
  app.enableCors({
    // I switched from 'true' because some browsers/proxies strip it in production.
    origin: [
      'http://localhost:3000',      // Allows Frontend devs working locally
      'http://127.0.0.1:3000',      // Safety net: some systems use IP instead of "localhost"
      'https://pos-inventory-system-r7w8.onrender.com', // Allows the backend to talk to itself (for health checks dont worry)
      'https://pos-inventory-system-eight.vercel.app',
      'https://pos-inventory-system-eight.vercel.app/'// allows backend to talk to frontend deployed on vercel
    ], 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // 2. Set Global Prefix
  app.setGlobalPrefix('api/v1');
  
  // SWAGGER SETUP
  const config = new DocumentBuilder()
    .setTitle('SwiftPOS API')
    .setDescription('The functional API documentation for the SwiftPOS inventory and sales system.')
    .setVersion('1.0')
    .addTag('auth', 'Staff authentication')
    .addTag('sales', 'POS transaction processing')
    .addTag('reports', 'Analytics and summaries')
    .addTag('inventory', 'Stock management')
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  // This makes your docs available at http://localhost:3001/api/docs
  SwaggerModule.setup('api/docs', app, document);
    
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