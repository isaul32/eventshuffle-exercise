import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { EventsModule } from './events/events.module';
import { AppController } from './app.controller';
import { HealthController } from './health/health.controller';
@Module({
  imports: [TerminusModule, EventsModule],
  controllers: [AppController, HealthController],
  providers: [],
})
export class AppModule {}
