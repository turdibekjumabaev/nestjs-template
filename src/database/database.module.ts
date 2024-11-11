import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { DbConfig } from 'src/common/configs';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [TypeOrmModule.forRoot(DbConfig), RedisModule],
})
export class DatabaseModule {
  constructor(private dataSource: DataSource) {}
}
