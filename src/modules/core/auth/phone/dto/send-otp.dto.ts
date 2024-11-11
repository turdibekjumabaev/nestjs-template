import { IsPhoneNumber } from "class-validator";

export class SendOtpDto {
    @IsPhoneNumber('UZ')
    public phone: string;
}
