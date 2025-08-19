import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { Request, Response, NextFunction } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const allowedOrigins = (process.env.CORS_ORIGINS ??
    'http://localhost:3000,https://conexa-web-az2w.vercel.app')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  app.enableCors({
  origin: true, // accepte tout, équivalent à '*'
  methods: ['GET','HEAD','PUT','PATCH','POST','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  credentials: false,
  });

  app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.method === 'OPTIONS') {
      const origin = req.headers.origin || '';
      if (allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin);
      }
      res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      return res.sendStatus(204);
    }
    next();
  });

  const config = new DocumentBuilder()
    .setTitle('Conexa API')
    .setDescription('API de la plateforme de prise de rendez-vous Conexa')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = Number(process.env.PORT) || 3001;
  await app.listen(port, '0.0.0.0');

  const publicUrl = process.env.RENDER_EXTERNAL_URL ?? `http://localhost:${port}`;
  console.log(`🚀 API started on ${publicUrl}`);
  console.log(`📚 Swagger docs: ${publicUrl}/api/docs`);
}
void bootstrap();
