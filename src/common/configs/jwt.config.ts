import * as NestConfig from '@nestjs/config';

export const JwtConfig = NestConfig.registerAs('jwt', () => {
    return {
        accessToken: {
            expiresIn: '1h',
            secret: process.env.JWT_ACCESS_SECRET ?? 'test',
            audience: process.env.JWT_ACCESS_AUDIENCE ?? 'test',
            issuer: process.env.JWT_ACCESS_ISSUER ?? 'test',
        },
        refreshToken: {
            expiresIn: '30d',
            secret: process.env.JWT_REFRESH_SECRET ?? 'yesy',
            audience: process.env.JWT_REFRESH_AUDIENCE ?? 'yesy',
            issuer: process.env.JWT_REFRESH_ISSUER ?? 'yesy',
        },
        admin: {
            expiresIn: 7 * 60 * 60 * 24,
            secret: process.env.JWT_ADMIN_SECRET ?? 'fuck',
        },
    };
});