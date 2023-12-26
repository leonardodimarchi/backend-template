import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnvService } from '../env/interfaces/env.service';
import { getDatasourceOptions } from './typeorm/datasource-options';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [EnvService],
      useFactory: (env: EnvService) => {
        return getDatasourceOptions(env.getAll());
      },
    }),
  ],
})
export class DatabaseModule {}
