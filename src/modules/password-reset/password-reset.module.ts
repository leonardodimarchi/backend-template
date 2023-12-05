@Module({
  imports: [PasswordResetDatabaseModule],
  controllers: [PasswordResetController],
  providers: [GetAllPasswordResetsUseCase, CreatePasswordResetUseCase],
})
export class PasswordResetModule {}
