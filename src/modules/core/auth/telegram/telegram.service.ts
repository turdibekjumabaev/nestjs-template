import { Injectable, NotFoundException } from '@nestjs/common';
import { OtpTelegramDto } from './dto/otp-telegram.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/database/entities';
import { Repository } from 'typeorm';
import { privateDecrypt } from 'crypto';
import { RedisService } from 'src/database/redis/redis.service';
import { TELEGRAM_BOT_OTP_PREFIX } from 'src/common/constants';
import { TokenService } from 'src/imp/token/token.service';

@Injectable()
export class TelegramService {

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private redisService: RedisService,
    private tokenService: TokenService
  ) { }

  public async checkOtpTelegram(otpTelegramDto: OtpTelegramDto) {
    const isExistOtpAndGetTgId = await this.redisService.get(TELEGRAM_BOT_OTP_PREFIX + otpTelegramDto.code);
    if (isExistOtpAndGetTgId) {
      const user = await this.userRepository.findOneBy({
        telegram_id: +isExistOtpAndGetTgId
      });

      
      await this.redisService.delete(TELEGRAM_BOT_OTP_PREFIX + otpTelegramDto.code)
      await this.redisService.delete(TELEGRAM_BOT_OTP_PREFIX + user.telegram_id)


      const userData = {
        id: user.id,
        first_name: user.first_name,
        sur_name: user.sur_name,
        middle_name: user.middle_name,
        avatar: user.avatar_url,
        phone: user.phone,
        email: user.email,
        telegram_id: user.telegram_id
      }

      const tokens = await this.tokenService.generateTokens(userData);

      return {
        user: userData,
        tokens: tokens
      }

    }

    throw new NotFoundException('code not found');
  }

}
