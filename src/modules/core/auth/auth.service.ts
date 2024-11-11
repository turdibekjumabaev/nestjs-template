import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/database/entities';
import { Repository } from 'typeorm';
import { OtpService } from 'src/imp/otp/otp.service';
import { SendOtpDto } from './dto/send-otp.dto';
import { CheckOTPDto } from './dto/check-otp.dto';
import { TokenService } from 'src/imp/token/token.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly otpService: OtpService,
    private readonly tokenService: TokenService
  ) { }

  public async sendOtp(sendOtpDto: SendOtpDto) {
    const expiry = await this.otpService.sendOTP(sendOtpDto.phone);

    return {
      message: 'OTP sent successfully',
      expiry: +expiry,
    }
  }

  public async checkOtp(checkOTPDto: CheckOTPDto) {
    await this.otpService.verifyOTP(checkOTPDto.phone, checkOTPDto.code);

    let user = await this.userRepository.findOneBy({ phone: checkOTPDto.phone });

    if (!user) {
      user = await this.userRepository.create({
        phone: checkOTPDto.phone,
        phone_verified_at: new Date()
      }).save();
    }

    await this.userRepository.update(user.id, {
      phone_verified_at: new Date()
    })

    const userData = {
      id: user.id,
      first_name: user.first_name,
      sur_name: user.sur_name,
      middle_name: user.middle_name,
      avatar: user.avatar_url,
      phone: user.phone,
      email: user.email,
    }

    const tokens = await this.tokenService.generateTokens(userData);

    return {
      user: userData,
      tokens: tokens
    }
  }

  public async refreshTokens(refreshToken: string) {
    const refreshTokenData = await this.tokenService.refreshTokenData(refreshToken)
    console.log('refreshTokenData:', refreshTokenData)
    const user = await this.userRepository.findOneBy({
      id: refreshTokenData.id,
    });

    const userData = {
      id: user.id,
      first_name: user.first_name,
      sur_name: user.sur_name,
      middle_name: user.middle_name,
      avatar: user.avatar_url,
      phone: user.phone,
      email: user.email,
    }

    const tokens = await this.tokenService.refreshTokens(userData, refreshTokenData.refreshTokenId);
    return {
      tokens: tokens
    }
  }

}
