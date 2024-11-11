import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/database/entities';
import { Repository } from 'typeorm';
import { OtpService } from 'src/imp/otp/otp.service';
import { TokenService } from 'src/imp/token/token.service';
import { SendOtpDto } from './dto/send-otp.dto';
import { CheckOTPDto } from './dto/check-otp.dto';

@Injectable()
export class PhoneService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly otpService: OtpService,
    private readonly tokenService: TokenService
  ) { }

  private async getUserData(user: User) {
    return {
      id: user.id,
      first_name: user.first_name,
      sur_name: user.sur_name,
      middle_name: user.middle_name,
      avatar: user.avatar_url,
      phone: user.phone,
      email: user.email,
      telegram_id: user.telegram_id,
    };
  }

  public async sendOtp(sendOtpDto: SendOtpDto) {
    const expiry = await this.otpService.sendOTP(sendOtpDto.phone);
    return { message: 'OTP sent successfully', expiry: +expiry };
  }

  public async checkOtp(checkOTPDto: CheckOTPDto) {
    await this.otpService.verifyOTP(checkOTPDto.phone, checkOTPDto.code);

    let user = await this.userRepository.findOneBy({ phone: checkOTPDto.phone });

    if (!user) {
      user = this.userRepository.create({
        phone: checkOTPDto.phone,
        phone_verified_at: new Date(),
      });
      await this.userRepository.save(user);
    } else {
      user.phone_verified_at = new Date();
      await this.userRepository.save(user);
    }

    const userData = await this.getUserData(user);
    const tokens = await this.tokenService.generateTokens(userData);

    return { user: userData, tokens };
  }

  public async refreshTokens(refreshToken: string) {
    const refreshTokenData = await this.tokenService.refreshTokenData(refreshToken);
    const user = await this.userRepository.findOneBy({ id: refreshTokenData.id });

    const userData = await this.getUserData(user);
    const tokens = await this.tokenService.refreshTokens(userData, refreshTokenData.refreshTokenId);

    return { tokens };
  }
}
