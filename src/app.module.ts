import { AuthModule } from '@modules/auth/auth.module';
import { CourseModule } from '@modules/course/course.module';
import { PasswordResetModule } from '@modules/password-reset/password-reset.module';
import { UserModule } from '@modules/user/user.module';
import { Module } from '@nestjs/common';
import { DatabaseModule } from '@shared/infra/database/database.module';
import { EnvModule } from '@shared/infra/env/env.module';
import { AcceptLanguageResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import * as path from 'path';

@Module({
  imports: [
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(__dirname, '/i18n/'),
        watch: true,
      },
      resolvers: [AcceptLanguageResolver, QueryResolver],
      typesOutputPath: path.join(
        __dirname,
        '../src/generated/i18n.generated.ts',
      ),
    }),
    { module: EnvModule, global: true },
    DatabaseModule,
    AuthModule,
    UserModule,
    CourseModule,
    PasswordResetModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
