import { Module } from '@nestjs/common';
import { MailService } from '@shared/domain/services/mail.service';
import { SESMailService } from './ses-mail.service';

@Module({
  exports: [MailService],
  providers: [
    {
      provide: MailService,
      useClass: SESMailService,
    },
  ],
})
export class MailModule {}
