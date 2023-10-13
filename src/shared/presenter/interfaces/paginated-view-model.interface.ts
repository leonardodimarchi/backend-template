import { ApiProperty } from '@nestjs/swagger';
import { PaginatedEntities } from '@shared/infra/database/interfaces/paginated-entities.interface';

type ViewModelConstructor<TEntity, TViewModel> = {
  new (entity: TEntity): TViewModel;
};

export class PaginatedViewModel<TEntity, TViewModel> {
  constructor(
    { page, totalPageCount, pageLimit, entities }: PaginatedEntities<TEntity>,
    viewModel: ViewModelConstructor<TEntity, TViewModel>,
  ) {
    this.page = page;
    this.totalPageCount = totalPageCount;
    this.pageLimit = pageLimit;
    this.items = entities.map((entity) => new viewModel(entity));
  }

  @ApiProperty()
  page: number;

  @ApiProperty()
  totalPageCount: number;

  @ApiProperty()
  pageLimit: number;

  @ApiProperty()
  items: TViewModel[];
}
