import {
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { RedisService } from 'src/database/redis/redis.service';

@Injectable()
export class RefreshTokenIdsStorage {
    constructor(private readonly redisService: RedisService) { }

    async insert(userId: number, tokenId: string): Promise<void> {
        await this.redisService.set(`token_user-${userId}`, tokenId);
    }

    async validate(userId: number, tokenId: string): Promise<boolean> {
        const storedId = await this.redisService.get(this.getRedisKey(userId));
        console.log(storedId, tokenId)
        if (storedId !== tokenId) {
            throw new UnauthorizedException();
        }
        await this.redisService.delete(this.getRedisKey(userId));
        return true
    }
    private getRedisKey(userId: number): string {
        return `token_user-${userId}`;
    }
}