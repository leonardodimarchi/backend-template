import { Module } from '@nestjs/common';
import { GenerateModuleService } from './generate-module.service';

@Module({
  providers: [GenerateModuleService],
})
export class CliModule {}
