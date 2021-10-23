import { Module } from '@nestjs/common';
import { EventsModule } from './events/events.module';
import { AppController } from './app.controller';
import { HealthModule } from './health/health.module';
@Module({
  imports: [HealthModule, EventsModule],
  controllers: [AppController],
})
export class AppModule {}
