export type InMemoryRepository<TRepo, TEntity> = TRepo & { items: TEntity[] };
