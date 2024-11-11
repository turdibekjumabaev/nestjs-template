import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SendOtpDto } from './dto/send-otp.dto';
import { CheckOTPDto } from './dto/check-otp.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { AccessTokenGuard } from 'src/common/guards';
import { Auth } from 'src/common/decorators';
import { AuthType } from 'src/common/enums';

@Auth(AuthType.None)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @HttpCode(HttpStatus.OK)
  @Post('send-otp')
  sendOTP(@Body() sendOtpDto: SendOtpDto) {
    return this.authService.sendOtp(sendOtpDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('check-otp')
  checkOTP(@Body() checkOTPDto: CheckOTPDto) {
    return this.authService.checkOtp(checkOTPDto)
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh-tokens')
  refreshTokens(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshTokens(refreshTokenDto.refresh_token);
  }

  @UseGuards(AccessTokenGuard)
  @Get('me')
  getProfile(@Request() req) {
    return req.user;
  }
}
