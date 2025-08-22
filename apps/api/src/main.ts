import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { MetricsInterceptor } from './interceptors/metrics.interceptor';
import { MetricsService } from './modules/metrics/metrics.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuration de l'intercepteur de métriques
  const metricsService = app.get(MetricsService);
  app.useGlobalInterceptors(new MetricsInterceptor(metricsService));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors({
    origin: true, 
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  const config = new DocumentBuilder()
    .setTitle('Conexa API')
    .setDescription('API de la plateforme de prise de rendez-vous Conexa')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = Number(process.env.PORT) || 3001;
  await app.listen(port, '0.0.0.0');

  const publicUrl =
    process.env.RENDER_EXTERNAL_URL ?? `http://localhost:${port}`;
  console.log(`🚀 API started on ${publicUrl}`);
  console.log(`📚 Swagger docs: ${publicUrl}/docs`);
  console.log(`🏥 Health checks: ${publicUrl}/health`);
  console.log(`📊 Metrics: ${publicUrl}/metrics`);
}
void bootstrap();
