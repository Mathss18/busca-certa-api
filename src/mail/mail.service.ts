import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { URL } from 'url';
import * as path from 'path';

export type Attachment = {
  url: string;
  contentDisposition?: 'attachment' | 'inline' | undefined;
};
@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendEmailWithTemplate(to: string, subject: string, templatePath: string, context: any, from?: string, attachments?: Attachment[]) {
    const options: ISendMailOptions = {
      to: to,
      subject: subject,
      template: templatePath,
      context: context,
      attachments: attachments ? await this.resolveAttachments(attachments) : null,
    };
    if (from) {
      options.from = from;
    }
    await this.mailerService.sendMail(options);
  }

  private async resolveAttachments(attachments: Attachment[]) {
    return await Promise.all(
      attachments.map(async (attachment) => {
        const { url, contentDisposition } = attachment;
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        const buffer = Buffer.from(response.data, 'utf-8');

        // Extract filename from URL
        const filename = path.basename(new URL(url).pathname);
        return {
          filename: filename,
          content: buffer,
          contentDisposition: contentDisposition ?? 'attachment',
        };
      }),
    );
  }
}
