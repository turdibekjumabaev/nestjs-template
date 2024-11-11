import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from 'src/database/entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OtpModule } from 'src/imp/otp/otp.module';
import { JwtModule } from '@nestjs/jwt';
import { TokenModule } from 'src/imp/token/token.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    OtpModule,
    JwtModule.register({
      global: true,
      signOptions: { expiresIn: '7d' },
    }),
    TokenModule
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule { }
