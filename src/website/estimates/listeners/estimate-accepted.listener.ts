import { OnEvent } from '@nestjs/event-emitter';
import { EstimateAcceptedEventType } from '../events/estimate-accepted.event';
import { Injectable } from '@nestjs/common';
import { EstimateRepository } from '../estimate.repository';
import { EstimatesTimelineService } from '../../estimates-timeline/estimates-timeline.service';
import { EstimateTimelineCode } from '../../estimates-timeline/enum/estimate-timeline.enum';
import { WhatsappService } from '../../../whatsapp/whatsapp.service';
import { MailService } from '../../../mail/mail.service';

@Injectable()
export class EstimateAcceptedListener {
  constructor(
    private readonly repository: EstimateRepository,
    private readonly estimatesTimelineService: EstimatesTimelineService,
    private readonly mailService: MailService,
    private readonly whatsappService: WhatsappService,
  ) {}

  @OnEvent('estimate.accepted')
  async notifyClient(event: EstimateAcceptedEventType) {
    try {
      const estimate = await this.repository.findWithVariationsAndEstimateInfo(event.estimateId);
      this.sendEmailToClient(estimate);
      this.sendWhatsappToClient(estimate);
    } catch (error) {
      console.log(error);
    }
  }

  @OnEvent('estimate.accepted')
  async notifySuppler(event: EstimateAcceptedEventType) {
    try {
      const estimate = await this.repository.findWithVariationsAndEstimateInfo(event.estimateId);
      this.sendEmailToSupplier(estimate);
      this.sendWhatsappToSupplier(estimate);
    } catch (error) {
      console.log(error);
    }
  }

  @OnEvent('estimate.accepted')
  addEventTimeline(event: EstimateAcceptedEventType) {
    this.estimatesTimelineService.create({
      estimateId: event.estimateId,
      code: EstimateTimelineCode.Events.SUPPLIER_ACCEPT_ESTIMATE.CODE,
      message: EstimateTimelineCode.Events.SUPPLIER_ACCEPT_ESTIMATE.MESSAGE,
    });
  }

  private sendEmailToClient(estimate) {
    const { id, clientName, clientEmail, product, quantity, price, estimateProductVariations } = estimate;

    try {
      this.mailService.sendEmailWithTemplate(clientEmail, 'Orçamento Aprovado!', './estimate-accepted-to-client', {
        estimateId: id,
        supplierName: product.supplier.companyName,
        clientName: clientName,
        productName: product.name,
        productSubtitle: product.subtitle,
        productImage: product.image,
        quantity: quantity,
        price: price,
        supplierEmail: product.supplier.email,
        supplierMobileNumber: this.formatPhoneNumber(product.supplier.mobileNumber),
        variations: estimateProductVariations.map((variation) => {
          return {
            variation: variation.variation.name,
            variationOption: variation.variationOption.name,
          };
        }),
      });
    } catch (error) {}
  }

  private async sendWhatsappToClient(estimate) {
    const { id, product, quantity, price, clientPhone } = estimate;
    try {
      const to = `55${clientPhone}`;
      await this.whatsappService.sendTemplateMessage(to, {
        name: 'estimate_accepted_to_client',
        language: {
          code: 'pt_BR',
        },
        components: [
          {
            type: 'body',
            parameters: [
              {
                type: 'text',
                text: `${id}`,
              },
              {
                type: 'text',
                text: product.name,
              },
              {
                type: 'text',
                text: `${quantity}`,
              },
              {
                type: 'currency',
                currency: {
                  fallback_value: `${price}`,
                  code: 'BRL',
                  amount_1000: price * 1000,
                },
              },
            ],
          },
        ],
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  private sendEmailToSupplier(estimate) {
    const { id, clientName, clientEmail, clientPhone, product, price, quantity, estimateProductVariations } = estimate;

    try {
      this.mailService.sendEmailWithTemplate(product.supplier.email, 'Orçamento Aprovado!', './estimate-accepted-to-supplier', {
        estimateId: id,
        supplierName: product.supplier.companyName,
        clientName: clientName,
        clientEmail: clientEmail,
        clientPhone: this.formatPhoneNumber(clientPhone),
        productName: product.name,
        productSubtitle: product.subtitle,
        productImage: product.image,
        quantity: quantity,
        price: price,
        variations: estimateProductVariations.map((variation) => {
          return {
            variation: variation.variation.name,
            variationOption: variation.variationOption.name,
          };
        }),
      });
    } catch (error) {}
  }

  private async sendWhatsappToSupplier(estimate) {
    const { product } = estimate;
    try {
      const to = `55${product.supplier.mobileNumber}`;
      await this.whatsappService.sendTemplateMessage(to, {
        language: {
          code: 'en_US',
        },
        name: 'hello_world',
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  private formatPhoneNumber(phoneNumber: string) {
    let formattedNumber = '';

    if (phoneNumber.length === 10) {
      formattedNumber = '(' + phoneNumber.slice(0, 2) + ') ' + phoneNumber.slice(2, 6) + '-' + phoneNumber.slice(6);
    } else if (phoneNumber.length === 11) {
      formattedNumber = '(' + phoneNumber.slice(0, 2) + ') ' + phoneNumber.slice(2, 7) + '-' + phoneNumber.slice(7);
    }

    return formattedNumber;
  }
}
