import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { Injectable } from '@nestjs/common';
import {
  MailService,
  SendMailOptions,
} from '@shared/domain/services/mail.service';
import { EnvVariableKeys } from '@shared/infra/env/interfaces/env-variables';
import { EnvService } from '@shared/infra/env/interfaces/env.service';

@Injectable()
export class SESMailService implements MailService {
  constructor(private readonly env: EnvService) {
    this.client = new SESClient({
      region: this.env.get(EnvVariableKeys.AWS_REGION),
    });
  }

  private readonly client: SESClient;

  async send(options: SendMailOptions): Promise<void> {
    const command = new SendEmailCommand({
      Source: this.env.get(EnvVariableKeys.MAIL_FROM),
      Message: {
        Subject: {
          Data: options.subject,
        },
        Body: {
          Html: {
            Data: options.bodyHtml,
          },
        },
      },
      Destination: {
        ToAddresses: options.to,
        ...(options.cc && { CcAddresses: options.cc }),
        ...(options.bcc && { BccAddresses: options.bcc }),
      },
    });

    this.client.send(command);
  }
}
