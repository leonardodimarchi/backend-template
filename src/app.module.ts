import { CourseModule } from '@modules/course/course.module';
import { UserModule } from '@modules/user/user.module';
import { Module } from '@nestjs/common';
import { DatabaseModule } from '@shared/infra/database/database.module';
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
      resolvers: [
        AcceptLanguageResolver,
        QueryResolver,
      ],
      typesOutputPath: path.join(__dirname, '../src/generated/i18n.generated.ts'),
    }),
    DatabaseModule,
    UserModule,
    CourseModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
