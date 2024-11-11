import { IsNumberString, Length } from "class-validator";

export class OtpTelegramDto {
    @IsNumberString()
    @Length(6, 6)
    public code: string
}
