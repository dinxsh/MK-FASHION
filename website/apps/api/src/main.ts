import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

export async function bootstrap() {
    const app = await NestFactory.create(AppModule);

  const allowedOrigin = process.env.APP_URL || 'http://localhost:3000';

  app.enableCors({
        origin: [allowedOrigin, 'http://localhost:3001'],
        credentials: true,
  });

  if (process.env.VERCEL) {
        await app.init();
        return app.getHttpAdapter().getInstance();
  }

  const port = process.env.PORT || 4000;
    await app.listen(port);
    console.log(`Application core is running on: http://localhost:${port}`);
}

if (!process.env.VERCEL) {
    bootstrap();
}
