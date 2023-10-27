import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnvModule } from '../env/env.module';
import { EnvService } from '../env/interfaces/env.service';
import { getDatasourceOptions } from './typeorm/datasource-options';

@Module({
  imports: [
    EnvModule,
    TypeOrmModule.forRootAsync({
      imports: [EnvModule],
      inject: [EnvService],
      useFactory: (env: EnvService) => {
        return getDatasourceOptions(env.getAll());
      },
    }),
  ],
})
export class DatabaseModule {}
