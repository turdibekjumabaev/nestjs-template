import { Controller, Post, Body, HttpStatus, HttpCode } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { OtpTelegramDto } from './dto/otp-telegram.dto';

@Controller('auth/telegram')
export class TelegramController {
  constructor(private readonly telegramService: TelegramService) { }

  @HttpCode(HttpStatus.OK)
  @Post('check-otp')
  checkOtpTelegram(@Body() otpTelegramDto: OtpTelegramDto) {
    return this.telegramService.checkOtpTelegram(otpTelegramDto);
  }

}
