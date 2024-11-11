import { Module } from '@nestjs/common';
import { SmsService } from './sms.service';
import { RedisModule } from 'src/database/redis/redis.module';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [RedisModule,
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        baseURL: configService.getOrThrow<string>('sms.baseURL'),
      }),
      inject: [ConfigService],
    }),],
  providers: [SmsService],
  exports: [SmsService]
})
export class SmsModule { }
