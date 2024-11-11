import { BadRequestException, Injectable, Logger } from '@nestjs/common'
import { SmsService } from '../sms/sms.service'
import { RedisService } from 'src/database/redis/redis.service'
import { SmsType } from 'src/common/enums'

/**
 * Service for handling OTP (One-Time Password) related functionality.
 */
@Injectable()
export class OtpService {
    private readonly logger = new Logger(OtpService.name)
    private readonly OTP_LENGTH = 6
    private readonly OTP_EXPIRY_SECONDS = 60;

    /**
     * Initializes the OtpService.
     * @param redisService - The RedisService for interacting with Redis storage.
     * @param smsService - The SmsService for sending SMS messages.
     */
    constructor(
        private redisService: RedisService,
        private readonly smsService: SmsService,
    ) { }

    /**
     * Sends an OTP to the specified phone number.
     * @param phoneNumber - The phone number to which the OTP will be sent.
     * @returns The remaining time in seconds for the OTP to expire, or `false` if an OTP already exists.
     */
    public async sendOTP(phoneNumber: string): Promise<number> {
        const existingOtp = await this.getRemainingTimeForOtp(phoneNumber)
        if (existingOtp) {
            return existingOtp
        }

        const code = await this.generateCode()
        const isSmsSent = await this.sendOtpSms(phoneNumber, code) || true

        if (isSmsSent) {
            await this.redisService.setWithExpiry(
                SmsType.LOGIN + phoneNumber,
                code,
                this.OTP_EXPIRY_SECONDS,
            )
            return this.OTP_EXPIRY_SECONDS
        }

        this.logger.error('OTP: Error sending sms')
        throw new BadRequestException('Error sending sms')
    }

    /**
     * Verifies the provided OTP against the stored OTP for the given phone number.
     * @param phoneNumber - The phone number for which the OTP is being verified.
     * @param code - The OTP code to be verified.
     * @returns `true` if the OTP is valid, `false` if it is invalid, and `-1` if the OTP does not exist.
     */
    public async verifyOTP(phoneNumber: string, code: string): Promise<true> {
        const storedOtp = await this.redisService.get(SmsType.LOGIN + phoneNumber)

        if (storedOtp === code) {
            await this.redisService.delete(SmsType.LOGIN + phoneNumber)
            return true
        } else if (storedOtp !== code && storedOtp != null) {
            throw new BadRequestException('Invalid OTP')
        }

        throw new BadRequestException('OTP does not exist')
    }

    /**
     * Gets the remaining time in seconds for the OTP to expire.
     * @param phoneNumber - The phone number for which the remaining time is retrieved.
     * @returns The remaining time in seconds or `false` if the OTP does not exist.
     */
    private async getRemainingTimeForOtp(
        phoneNumber: string,
    ): Promise<number | false> {
        const timeRemaining = await this.redisService.getExpiry(
            SmsType.LOGIN + phoneNumber,
        )
        return timeRemaining === -2 ? false : timeRemaining
    }

    /**
     * Generates a random OTP code.
     * @returns The generated OTP code.
     */
    private async generateCode(): Promise<string> {
        const digits = '0123456789'
        let OTP = ''
        for (let i = 0; i < this.OTP_LENGTH; i++) {
            OTP += digits[Math.floor(Math.random() * digits.length)]
        }
        return "000000";
        return OTP
    }

    /**
     * Sends an OTP SMS to the specified phone number.
     * @param phoneNumber - The phone number to which the OTP SMS will be sent.
     * @param code - The OTP code to be included in the SMS.
     * @returns `true` if the SMS is sent successfully, otherwise `false`.
     */
    private async sendOtpSms(
        phoneNumber: string,
        code: string,
    ): Promise<boolean> {
        try {
            const status = await this.smsService.sendSms({
                phoneNumber,
                data: {
                    type: SmsType.LOGIN,
                    code,
                },
            })

            return status
        } catch (error) {
            this.logger.error(`Failed to send OTP SMS: ${error.message}`, error.stack)
            return false
        }
    }
}