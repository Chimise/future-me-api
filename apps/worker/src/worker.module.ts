import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { DatabaseModule } from 'app/shared';
import { WorkerController } from './worker.controller';
import { WorkerService } from './worker.service';

@Module({
  imports: [DatabaseModule, BullModule.forRoot({
    redis: {
      host: process.env.REDIS_HOST ?? 'localhost',
      port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379
    }
  }), ScheduleModule.forRoot()],
  controllers: [WorkerController],
  providers: [WorkerService],
})
export class WorkerModule { }
