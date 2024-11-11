import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { TelegramController } from './telegram.controller';
import { TelegramBotModule } from './telegram-bot/telegram-bot.module';
import { RedisModule } from 'src/database/redis/redis.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/database/entities';
import { TokenModule } from 'src/imp/token/token.module';

@Module({
  imports: [
    TelegramBotModule,
    RedisModule,
    TypeOrmModule.forFeature([User]),
    TokenModule
  ],
  controllers: [TelegramController],
  providers: [TelegramService],
})
export class TelegramModule { }
