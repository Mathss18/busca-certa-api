import { Test, TestingModule } from '@nestjs/testing';
import { WhatsappService, TemplateMessagePayload } from './whatsapp.service';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('WhatsappService', () => {
  let service: WhatsappService;
  const configService = { get: jest.fn().mockReturnValue('test_value') };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WhatsappService,
        {
          provide: ConfigService,
          useValue: configService,
        },
      ],
    }).compile();

    service = module.get<WhatsappService>(WhatsappService);
  });

  it('should send a template message', async () => {
    const to = '123456789';
    const payload: TemplateMessagePayload = {
      name: 'test',
      language: {
        code: 'en',
      },
    };
    const data = {
      messaging_product: 'whatsapp',
      to: to,
      type: 'template',
      template: {
        namespace: '92866f51_8b55_4e71_ac83_52688232891e',
        ...payload,
      },
    };
    mockedAxios.post.mockResolvedValue({ data: {} });

    await service.sendTemplateMessage(to, payload);

    expect(axios.post).toHaveBeenCalledWith(configService.get('whatsapp.apiUrl'), data, {
      headers: {
        Authorization: `Bearer ${configService.get('whatsapp.apiToken')}`,
        'Content-Type': 'application/json',
      },
    });
  });
});
