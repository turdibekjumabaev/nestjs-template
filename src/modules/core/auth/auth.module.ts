import { Global, Module } from '@nestjs/common';
import { PhoneModule } from './phone/phone.module';
import { TelegramModule } from './telegram/telegram.module';
import { JwtModule } from '@nestjs/jwt';
import { TokenModule } from 'src/imp/token/token.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/database/entities';

@Global()
@Module({
  imports: [
    JwtModule.register({
      global: true,
      signOptions: { expiresIn: '7d' },
    }),
    TypeOrmModule.forFeature([User]),
    TokenModule,
    PhoneModule,
    TelegramModule]
})
export class AuthModule { }
