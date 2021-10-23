import { RequestMethod, ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as compression from 'compression';
import * as helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(compression());
  app.use(helmet());
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api', {
    exclude: [
      { path: '', method: RequestMethod.GET }, // Exclude root redirect
    ],
  });
  app.enableVersioning({
    type: VersioningType.URI,
  });

  const config = new DocumentBuilder()
    .setTitle('Eventshuffle backend API')
    .setDescription('The awesome API to help scheduling events with friends.')
    .setLicense(
      'MIT',
      'https://github.com/isaul32/eventshuffle-exercise/blob/main/LICENSE',
    )
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
