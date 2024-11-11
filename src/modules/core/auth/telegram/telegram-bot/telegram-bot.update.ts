import { Action, Command, Ctx, On, Start, Update } from 'nestjs-telegraf';
import { Markup } from 'telegraf';
import { UseFilters } from '@nestjs/common';
import { TelegrafExceptionFilter } from 'src/common/filters';
import { generateOtpCode } from 'src/common/utils';
import { RedisService } from 'src/database/redis/redis.service';
import { TELEGRAM_BOT_OTP_PREFIX } from 'src/common/constants';
import { SceneContext } from 'telegraf/typings/scenes';
import { Update as CoreUpdate } from 'telegraf/typings/core/types/typegram';
import { Context } from './interfaces/context.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/database/entities';
import { Repository } from 'typeorm';

@Update()
@UseFilters(TelegrafExceptionFilter)
export class TelegramBotUpdate {

  constructor(
    @InjectRepository(User)
    private userReposioty: Repository<User>,
    private redisService: RedisService
  ) { }

  private async generateAndSendOtp(phone, ctx: Context): Promise<void> {
    const otpCode = generateOtpCode(6);
    await ctx.reply(
      `🔒 Code: \n\`\`\`${otpCode}\`\`\``,
      {
        parse_mode: 'MarkdownV2',
        ...Markup.inlineKeyboard([
          Markup.button.callback('🔄 Refresh', 'refresh'),
        ])
      }
    );
    await this.redisService.setWithExpiry(TELEGRAM_BOT_OTP_PREFIX + otpCode, `${ctx.chat.id}`, 60);
    await this.redisService.setWithExpiry(TELEGRAM_BOT_OTP_PREFIX + ctx.chat.id, '1', 60)
  }

  @Start()
  async onStart(@Ctx() ctx: Context): Promise<void> {
    const text = `Hello ${ctx.from.first_name} 🚀 👋\nWelcome to the official bot of @qirikki\n\n⬇️ Send your contact (press the button)`;

    await ctx.reply(text, Markup.keyboard([
      [Markup.button.contactRequest('📞 Send Contact')]
    ]).resize().oneTime());
  }

  @Command('login')
  async onLogin(@Ctx() ctx: Context): Promise<void> {
    const user = await this.userReposioty.findOneBy({ telegram_id: ctx.chat.id })
    const existingOtp = await this.redisService.get(TELEGRAM_BOT_OTP_PREFIX + ctx.chat.id);
    if (existingOtp) {
      await ctx.reply('Your old code is still effective ☝️');
      return;
    }
    await this.generateAndSendOtp(user.phone, ctx);
  }

  @Action('refresh')
  async onRefresh(@Ctx() ctx: SceneContext & { update: CoreUpdate.CallbackQueryUpdate }): Promise<void> {
    const user = await this.userReposioty.findOneBy({ telegram_id: ctx.chat.id })
    const existingOtp = await this.redisService.get(TELEGRAM_BOT_OTP_PREFIX + ctx.chat.id);
    if (existingOtp) {
      await ctx.answerCbQuery('Your old code is still effective ☝️', { show_alert: true });
      return;
    }
    await ctx.deleteMessage();
    await this.generateAndSendOtp(user.phone, ctx);
  }

  @On('contact')
  async onContact(@Ctx() ctx: Context): Promise<void> {
    // @ts-ignore
    const { phone_number } = ctx.message.contact;
    const isExistUser = await this.userReposioty.findOneBy({ telegram_id: ctx.from.id })
    if (!isExistUser) {
      await this.userReposioty.create({
        telegram_id: ctx.from.id,
        first_name: ctx.from.first_name,
        sur_name: ctx.from.last_name ?? null,
        phone: phone_number
      }).save()
    }
    await this.generateAndSendOtp(phone_number, ctx);
    await ctx.reply('🇺🇸🔑\nTo get a new code click /login');
  }
}
