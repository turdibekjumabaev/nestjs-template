import { IsDate, isDate, IsDateString, IsEmail, IsPhoneNumber, IsString } from "class-validator";

export class ProfileDto {
    @IsString()
    first_name: string;

    @IsString()
    sur_name: string;

    @IsString()
    middle_name: string;

    @IsPhoneNumber('UZ')
    phone: string;

    @IsDateString()
    date_of_birth: Date;

    @IsEmail()
    email: string;
}
