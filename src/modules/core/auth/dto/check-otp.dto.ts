import { IsNumberString, IsPhoneNumber, Length } from "class-validator";

export class CheckOTPDto {
    @IsPhoneNumber('UZ')
    public phone: string;

    @IsNumberString()
    @Length(6, 6)
    public code: string
}