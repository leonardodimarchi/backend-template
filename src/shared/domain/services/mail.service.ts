export interface SendMailOptions {
  to: string;
  subject: string;
  bodyHtml: string;
}

export abstract class MailService {
  abstract send(options: SendMailOptions): Promise<void>;
}
