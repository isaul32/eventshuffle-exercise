import { Module } from '@nestjs/common';
import { EventsModule } from './events/events.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health/health.controller';
@Module({
  imports: [TerminusModule, EventsModule],
  controllers: [AppController, HealthController],
  providers: [AppService],
})
export class AppModule {}
