import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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
