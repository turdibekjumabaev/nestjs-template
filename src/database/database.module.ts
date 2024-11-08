import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { DbConfig } from 'src/common/configs';

@Module({
  imports: [TypeOrmModule.forRoot(DbConfig)],
})
export class DatabaseModule {
  constructor(private dataSource: DataSource) {}
}
