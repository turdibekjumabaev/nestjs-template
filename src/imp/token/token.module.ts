import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { RefreshTokenIdsStorage } from './refresh-token-ids.storage';
import { RedisModule } from 'src/database/redis/redis.module';

@Module({
  imports: [RedisModule],
  providers: [TokenService, RefreshTokenIdsStorage],
  exports: [TokenService],
})
export class TokenModule { }
