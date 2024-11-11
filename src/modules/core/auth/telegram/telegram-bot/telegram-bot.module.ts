import { Module } from '@nestjs/common';
import { TelegramBotUpdate } from './telegram-bot.update';
import { TelegrafModule } from 'nestjs-telegraf';
import { RedisModule } from 'src/database/redis/redis.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/database/entities';

@Module({
  imports: [
    TelegrafModule.forRoot({
      botName: process.env.TELEGRAM_BOT_NAME,
      token: process.env.TELEGRAM_BOT_TOKEN,
      include: [TelegramBotModule],
    }),
    TypeOrmModule.forFeature([User]),
    RedisModule,
  ],
  providers: [TelegramBotUpdate],
})
export class TelegramBotModule { }
