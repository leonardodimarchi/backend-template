import { ApiPropertyOptional } from '@nestjs/swagger';

export class PaginatedQueryParams {
  @ApiPropertyOptional({ default: 1 })
  page?: number;

  @ApiPropertyOptional({ default: 10 })
  pageLimit?: number;
}
