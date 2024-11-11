import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import { SmsType } from 'src/common/enums';
import { IGetToken, ISendSmsOptions } from 'src/common/interfaces';
import { RedisService } from 'src/database/redis/redis.service';

@Injectable()
export class SmsService {
    private readonly logger = new Logger(SmsService.name);
    private readonly email: string;
    private readonly password: string;

    // Constants
    private readonly SMS_SENDER = '4546';
    private readonly SMS_ACCESS_TOKEN_KEY = 'sms_service_access_token';


    constructor(
        private readonly httpService: HttpService,
        private configService: ConfigService,
        private readonly redisService: RedisService

    ) {
        const { email, password } = this.configService.get('sms');
        this.email = email;
        this.password = password;
    }

    public async sendSms(options: ISendSmsOptions): Promise<boolean> {
        return true;
        const token = await this.getToken();
        await this.apiSendSms(options, token);
    }

    private async login(): Promise<IGetToken> {
        try {
            const { data } = await firstValueFrom(
                this.httpService
                    .post<IGetToken>('/auth/login', {
                        email: this.email,
                        password: this.password,
                    })
                    .pipe(
                        catchError((error: AxiosError) => {
                            this.logger.error(error.response.data);
                            throw new Error('Failed to get token.');
                        }),
                    ),
            );
            return data;
        } catch (error) {
            this.logger.error(error.message);
             throw new InternalServerErrorException('An error happened!');
        }
    }

    private async getToken(): Promise<string> {
        const token = await this.redisService.get(this.SMS_ACCESS_TOKEN_KEY)

        if (token) {
            return token;
        }

        const response = await this.login();
        await this.redisService.set(this.SMS_ACCESS_TOKEN_KEY, response.data.token)

        return response.data.token;
    }

    private getMessage(type: SmsType, code: string, message: string): string {
        switch (type) {
            case SmsType.LOGIN:
            case SmsType.FORGOT_PASSWORD:
                return `${code} - 24GO.uz dan tasdiqlash kodingiz`;
            case SmsType.MESSAGE:
                return message;
            default:
                return '';
        }
    }

    private async apiSendSms(
        options: ISendSmsOptions,
        token: string,
    ): Promise<any> {
        const {
            phoneNumber,
            data: { type, code, message },
        } = options;

        const msg = this.getMessage(type, code, message);

        const { data } = await firstValueFrom(
            this.httpService
                .post(
                    '/message/sms/send',
                    {
                        mobile_phone: phoneNumber,
                        message: msg,
                        from: this.SMS_SENDER,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    },
                )
                .pipe(
                    catchError(async (error: AxiosError) => {
                        if (error.response.status === 401) {
                            const newToken = await this.login();

                            await this.redisService.set(this.SMS_ACCESS_TOKEN_KEY, newToken.data.token)

                            await this.apiSendSms(options, newToken.data.token);
                        }
                        this.logger.error(error.response.data);
                        throw new InternalServerErrorException('An error happened!');
                    }),
                ),
        );
        return data;
    }
}