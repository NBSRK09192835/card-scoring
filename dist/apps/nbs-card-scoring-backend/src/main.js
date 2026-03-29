import { NestFactory } from '@nestjs/core';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
async function bootstrap() {
    const app = await NestFactory.create(AppModule, new FastifyAdapter());
    app.enableCors();
    await app.listen(3333, '0.0.0.0');
    console.log('nbs-card-scoring-backend started on http://localhost:3333');
}
bootstrap();
//# sourceMappingURL=main.js.map