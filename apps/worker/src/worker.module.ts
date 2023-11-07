import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { DatabaseModule } from 'app/shared';
import { MessageModule } from './message/message.module';

@Module({
  imports: [BullModule.forRoot({
    redis: {
      host: process.env.REDIS_HOST ?? 'localhost',
      port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379
    }
  }), ScheduleModule.forRoot(), DatabaseModule, MessageModule]
})
export class WorkerModule { }
