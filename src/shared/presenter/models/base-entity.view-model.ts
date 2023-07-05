import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '@shared/domain/base.entity';
import { UUID } from 'crypto';

export class BaseEntityViewModel {
  constructor(entity: BaseEntity<object>) {
    this.id = entity.id;
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
  }

  @ApiProperty({ example: '<UUID>' })
  id: UUID;

  @ApiProperty({ example: new Date() })
  createdAt: Date;

  @ApiProperty({ example: new Date() })
  updatedAt: Date;
}
