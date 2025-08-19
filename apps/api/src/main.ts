import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Validation globale
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // CORS strict : uniquement ton front dev + prod
  const allowedOrigins = (process.env.CORS_ORIGINS ??
    'http://localhost:3000,https://conexa-web-az2w.vercel.app')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  app.enableCors({
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false, // mets true seulement si tu utilises des cookies
  });

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Conexa API')
    .setDescription('API de la plateforme de prise de rendez-vous Conexa')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Render → écoute sur 0.0.0.0 et PORT
  const port = Number(process.env.PORT) || 3001;
  await app.listen(port, '0.0.0.0');

  const publicUrl = process.env.RENDER_EXTERNAL_URL ?? `http://localhost:${port}`;
  console.log(`🚀 API started on ${publicUrl}`);
  console.log(`📚 Swagger docs: ${publicUrl}/api/docs`);
}
void bootstrap();
