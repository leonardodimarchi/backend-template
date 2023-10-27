import { Module } from '@nestjs/common';
import { EnvService } from './interfaces/env.service';
import { DotEnvService } from './services/dot-env.service';

@Module({
  providers: [
    {
      provide: EnvService,
      useClass: DotEnvService,
    },
  ],
  exports: [EnvService],
})
export class EnvModule {}
