import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SuccessResponseInterceptor } from './common/interceptors';
import { ExceptionsFilter } from './common/filters';
import { ClassValidationPipe } from './common/pipes';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(new SuccessResponseInterceptor())
  app.useGlobalFilters(new ExceptionsFilter())
  app.useGlobalPipes(new ClassValidationPipe())

  app.setGlobalPrefix('/v1/api')

  await app.listen(process.env.APP_PORT, process.env.APP_HOST, async () => {
    console.log(await app.getUrl());
  });
}
bootstrap();
