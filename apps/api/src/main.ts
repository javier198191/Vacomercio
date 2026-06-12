import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable Validation Pipes globally
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));

  // Enable CORS for frontend requests
  app.enableCors();

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`Vacomercio NestJS API running on http://localhost:${port}`);
}
bootstrap();
