import { Module } from '@nestjs/common';
import { PhoneService } from './phone.service';
import { PhoneController } from './phone.controller';
import { OtpModule } from 'src/imp/otp/otp.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/database/entities';
import { TokenModule } from 'src/imp/token/token.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    TokenModule,
    OtpModule,
  ],
  controllers: [PhoneController],
  providers: [PhoneService],
})
export class PhoneModule { }
