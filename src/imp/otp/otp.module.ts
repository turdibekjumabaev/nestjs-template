import { Module } from '@nestjs/common';
import { OtpService } from './otp.service';
import { SmsModule } from '../sms/sms.module';
import { RedisModule } from 'src/database/redis/redis.module';

@Module({
  imports: [
    SmsModule,
    RedisModule,
  ],
  providers: [OtpService],
  exports: [OtpService]
})
export class OtpModule { }
