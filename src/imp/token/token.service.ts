import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService, ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';
import { JwtConfig } from 'src/common/configs';
import { RefreshTokenIdsStorage } from './refresh-token-ids.storage';
import { ITokenPayload } from 'src/common/interfaces';
import { IActiveUser } from 'src/common/interfaces/active-user/active-user.interface';

interface ITokenPayloadWithRefreshToken extends ITokenPayload {
    refreshTokenId: string;
}

@Injectable()
export class TokenService {
    private readonly jwtConfig: ConfigType<typeof JwtConfig>;
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private refreshTokenIdsStorage: RefreshTokenIdsStorage,
    ) {
        this.jwtConfig = this.configService.getOrThrow<ConfigType<typeof JwtConfig>>('jwt');
    }

    public async generateTokens(payload: IActiveUser): Promise<{ accessToken: string, refreshToken: string }> {
        const accessToken = await this.jwtService.signAsync(payload, {
            secret: this.jwtConfig.accessToken.secret,
            expiresIn: this.jwtConfig.accessToken.expiresIn,
        });

        const refreshTokenId = randomUUID();
        console.log('GENERATIO ID REFRESH', refreshTokenId)
        const refreshToken = await this.jwtService.signAsync({
            ...payload,
            refreshTokenId
        }, {
            secret: this.jwtConfig.refreshToken.secret,
            audience: this.jwtConfig.refreshToken.audience,
            issuer: this.jwtConfig.refreshToken.issuer,
        });


        await this.refreshTokenIdsStorage.insert(payload.id, refreshTokenId);
        return Object.assign({ access_token: accessToken, refresh_token: refreshToken });
    }

    public async refreshTokenData(refreshToken: string): Promise<ITokenPayloadWithRefreshToken> {
        try {
            const tokenData = await this.jwtService.verifyAsync(refreshToken, {
                secret: this.jwtConfig.refreshToken.secret,
                audience: this.jwtConfig.refreshToken.audience,
                issuer: this.jwtConfig.refreshToken.issuer,
            });
            return tokenData
        } catch (error) {
            throw new UnauthorizedException('Unauthorized');
        }
    }

    public async refreshTokens(user, refreshTokenId) {
        await this.refreshTokenIdsStorage.validate(
            user.id,
            refreshTokenId,
        );
        return this.generateTokens(user);
    }

    public async logout(refreshTokenId: string) {
    }

}