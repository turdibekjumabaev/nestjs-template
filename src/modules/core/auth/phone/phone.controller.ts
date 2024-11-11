import { Controller, Get, Post, Body, HttpCode, HttpStatus, UseGuards, Request } from '@nestjs/common';
import { PhoneService } from './phone.service';
import { AccessTokenGuard } from 'src/common/guards';
import { SendOtpDto } from './dto/send-otp.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { CheckOTPDto } from './dto/check-otp.dto';

@Controller('auth/phone')
export class PhoneController {
  constructor(private readonly phoneService: PhoneService) { }

  @HttpCode(HttpStatus.OK)
  @Post('send-otp')
  sendOTP(@Body() sendOtpDto: SendOtpDto) {
    return this.phoneService.sendOtp(sendOtpDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('check-otp')
  checkOTP(@Body() checkOTPDto: CheckOTPDto) {
    return this.phoneService.checkOtp(checkOTPDto)
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh-tokens')
  refreshTokens(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.phoneService.refreshTokens(refreshTokenDto.refresh_token);
  }

  @UseGuards(AccessTokenGuard)
  @Get('me')
  getProfile(@Request() req) {
    return req.user;
  }
}
