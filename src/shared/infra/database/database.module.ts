import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './typeorm/datasource-options';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        return dataSourceOptions;
      }
    }),
  ],
})
export class DatabaseModule {}
