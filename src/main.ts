import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { ApiResponseInterceptor } from './common/interceptors/api-response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: false, // On gère le CORS après explicitement
  });

  app.useGlobalInterceptors(new ApiResponseInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter());

  const allowedOrigins = (process.env.URLS_AUTHORIZED || '')
    .split(',')
    .map((origin) => origin.trim());

  if (process.env.APP_ENV !== 'production') {
    app.enableCors({
      origin: '*',
      allowedHeaders: '*',
      credentials: true,
    });
  } else {
    app.enableCors({
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true,
    });
  }

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // supprime les champs non définis dans DTO
      forbidNonWhitelisted: true, // renvoie une erreur si des champs non autorisés sont envoyés
      transform: true, // transforme payload en instance de DTO
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Senima API')
    .setDescription('API pour Senima Company')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();
