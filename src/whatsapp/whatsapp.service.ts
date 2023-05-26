import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { IWhatsappService } from './whatsapp-service.interface';
import { ConfigService } from '@nestjs/config';

/* Documentation
 * https://developers.facebook.com/docs/whatsapp/cloud-api/reference/messages#template-object
 * https://medium.com/@sivaprasath_42353/whatsapp-custom-template-to-json-4447f9915404
 * https://www.youtube.com/watch?v=lH-1UaQYpsg
 */
export type Component = {
  type: 'body' | 'header' | 'button';
  sub_type?: 'text' | 'url';
  index?: number;
  parameters?: {
    type: 'currency' | 'date_time' | 'document' | 'image' | 'text' | 'video';
    currency?: {
      fallback_value: string;
      code: string;
      amount_1000: number;
    };
    payload?: string;
    text?: string;
  }[];
};
export type TemplateMessagePayload = {
  name: string;
  language: {
    code: string;
  };
  components?: Component[];
};

@Injectable()
export class WhatsappService implements IWhatsappService {
  constructor(private readonly configService: ConfigService) {}

  private headers = {
    Authorization: `Bearer ${this.configService.get('whatsapp.apiToken')}`,
    'Content-Type': 'application/json',
  };

  async sendTemplateMessage(to: string, payload: TemplateMessagePayload): Promise<void> {
    const data = {
      messaging_product: 'whatsapp',
      to: to,
      type: 'template',
      template: {
        namespace: '92866f51_8b55_4e71_ac83_52688232891e',
        ...payload,
      },
    };
    try {
      try {
        return await axios.post(this.configService.get('whatsapp.apiUrl'), data, { headers: this.headers });
      } catch (error) {
        console.log('Falha ao enviar Whatsapp' + error.message);
        throw error;
      }
    } catch (error) {
      throw error;
    }
  }
}
