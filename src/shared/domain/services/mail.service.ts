export interface SendMailOptions {
  to: string[];
  subject: string;
  bodyHtml: string;
  cc?: string[];
  bcc?: string[];
}

export abstract class MailService {
  abstract send(options: SendMailOptions): Promise<void>;
}
