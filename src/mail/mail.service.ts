import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendEmailWithTemplate(to: string, subject: string, templatePath: string, context: any, from?: string) {
    const options: ISendMailOptions = {
      to: to,
      subject: subject,
      template: templatePath,
      context: context,
    };
    if (from) {
      options.from = from;
    }
    await this.mailerService.sendMail(options);
  }
}
