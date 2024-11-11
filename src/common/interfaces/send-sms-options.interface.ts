import { SmsType } from "../enums";

export interface ISendSmsOptions {
    phoneNumber: string;
    data: {
        type: SmsType;
        code?: string;
        message?: string;
    };
}