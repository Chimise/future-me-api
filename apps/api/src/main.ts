import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';



async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe({ skipMissingProperties: false, forbidUnknownValues: true }));
  app.enableVersioning({
    defaultVersion: '1',
    type: VersioningType.URI
  })
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
