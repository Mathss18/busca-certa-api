import { Test, TestingModule } from '@nestjs/testing';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { Attachment, MailService } from './mail.service';
import axios from 'axios';

jest.mock('@nestjs-modules/mailer');
jest.mock('axios');

describe('MailService', () => {
  let service: MailService;
  let mailerService: MailerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MailService, MailerService],
    }).compile();

    service = module.get<MailService>(MailService);
    mailerService = module.get<MailerService>(MailerService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should send an email with template and attachments', async () => {
    const to = 'test@example.com';
    const subject = 'Test Email';
    const templatePath = 'templates/test-template';
    const context = { name: 'John Doe' };
    const from = 'sender@example.com';
    const attachments: Attachment[] = [
      { url: 'https://example.com/image1.jpg', contentDisposition: 'attachment' },
      { url: 'https://example.com/image2.jpg', contentDisposition: 'inline' },
    ];

    const expectedOptions: ISendMailOptions = {
      to: to,
      subject: subject,
      template: templatePath,
      context: context,
      attachments: [
        {
          filename: 'image1.jpg',
          content: expect.any(Buffer),
          contentDisposition: 'attachment',
        },
        {
          filename: 'image2.jpg',
          content: expect.any(Buffer),
          contentDisposition: 'inline',
        },
      ],
      from: from,
    };

    // Mock the axios response for attachment URLs
    const axiosGetMock = axios.get as jest.Mock;
    axiosGetMock.mockResolvedValueOnce({ data: 'image1-data', headers: {} });
    axiosGetMock.mockResolvedValueOnce({ data: 'image2-data', headers: {} });

    await service.sendEmailWithTemplate(to, subject, templatePath, context, from, attachments);

    expect(mailerService.sendMail).toHaveBeenCalledWith(expectedOptions);
    expect(axios.get).toHaveBeenCalledWith('https://example.com/image1.jpg', { responseType: 'arraybuffer' });
    expect(axios.get).toHaveBeenCalledWith('https://example.com/image2.jpg', { responseType: 'arraybuffer' });
  });

  it('should send an email with template and without attachments', async () => {
    const to = 'test@example.com';
    const subject = 'Test Email';
    const templatePath = 'templates/test-template';
    const context = { name: 'John Doe' };

    const expectedOptions: ISendMailOptions = {
      to: to,
      subject: subject,
      template: templatePath,
      context: context,
      attachments: null,
    };

    await service.sendEmailWithTemplate(to, subject, templatePath, context);

    expect(mailerService.sendMail).toHaveBeenCalledWith(expectedOptions);
    expect(axios.get).not.toHaveBeenCalled();
  });
});
