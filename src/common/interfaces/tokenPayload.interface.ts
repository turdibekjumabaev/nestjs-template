import { User } from "src/database/entities";

export interface ITokenPayload extends Partial<User> {
    id: number;
}

export interface TokenPayloadForAdmin extends ITokenPayload {
    id: number;
    roles: string[];
    permissions: string[];
    iat?: number;
    exp?: number;
}