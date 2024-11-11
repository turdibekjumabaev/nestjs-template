import * as NestConfig from '@nestjs/config';

export const SmsConfig = NestConfig.registerAs('sms', () => ({
    baseURL: process.env.SMS_BASE_URL,
    email: process.env.SMS_EMAIL || 3000,
    password: process.env.SMS_PASSWORD,
}));