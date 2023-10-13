export interface PaginatedEntities<TEntity> {
  page: number;
  totalPageCount: number;
  pageLimit: number;
  entities: TEntity[];
}
