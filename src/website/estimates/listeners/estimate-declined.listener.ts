import { OnEvent } from '@nestjs/event-emitter';
import { EstimateDeclinedEventType } from '../events/estimate-declined.event';
import { Injectable } from '@nestjs/common';
import { EstimateRepository } from '../estimate.repository';
import { EstimatesTimelineService } from '../../estimates-timeline/estimates-timeline.service';
import { EstimateTimelineCode } from '../../estimates-timeline/enum/estimate-timeline.enum';
import { WhatsappService } from '../../../whatsapp/whatsapp.service';
import { MailService } from '../../../mail/mail.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EstimateDeclinedListener {
  constructor(
    private readonly repository: EstimateRepository,
    private readonly estimatesTimelineService: EstimatesTimelineService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
    private readonly whatsappService: WhatsappService,
  ) {}

  @OnEvent('estimate.declined')
  async notifyClient(event: EstimateDeclinedEventType) {
    try {
      const estimate = await this.repository.findWithVariationsAndEstimateInfo(event.estimateId);
      this.sendEmailToClient(estimate);
      this.sendWhatsappToClient(estimate);
    } catch (error) {
      console.log(error);
    }
  }

  @OnEvent('estimate.declined')
  async notifySuppler(event: EstimateDeclinedEventType) {
    try {
      const estimate = await this.repository.findWithVariationsAndEstimateInfo(event.estimateId);
      this.sendEmailToSupplier(estimate);
    } catch (error) {
      console.log(error);
    }
  }

  @OnEvent('estimate.declined')
  addEventTimeline(event: EstimateDeclinedEventType) {
    this.estimatesTimelineService.create({
      estimateId: event.estimateId,
      code: EstimateTimelineCode.Events.SUPPLIER_ACCEPT_ESTIMATE.CODE,
      message: EstimateTimelineCode.Events.SUPPLIER_ACCEPT_ESTIMATE.MESSAGE,
    });
  }

  private sendEmailToClient(estimate) {
    const { id, clientName, clientEmail, product, quantity, estimateProductVariations } = estimate;

    try {
      this.mailService.sendEmailWithTemplate(clientEmail, 'Orçamento Recusado', './estimate-declined-to-client', {
        estimateId: id,
        supplierName: product.supplier.companyName,
        clientName: clientName,
        productName: product.name,
        productSubtitle: product.subtitle,
        productImage: product.image,
        quantity: quantity,
        findAnotherSupplierLink: this.configService.get('WEBSITE_URL'),
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
    const { id, product, quantity, clientPhone } = estimate;
    try {
      const to = `55${clientPhone}`;
      await this.whatsappService.sendTemplateMessage(to, {
        name: 'estimate_declined_to_client',
        language: {
          code: 'pt_BR',
        },
        components: [
          {
            type: 'body',
            parameters: [
              {
                type: 'text',
                text: `#${id}`,
              },
              {
                type: 'text',
                text: product.name,
              },
              {
                type: 'text',
                text: `${quantity}`,
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
    const { id, clientName, product, quantity, estimateProductVariations } = estimate;

    try {
      this.mailService.sendEmailWithTemplate(product.supplier.email, 'Orçamento Recusado!', './estimate-declined-to-supplier', {
        estimateId: id,
        supplierName: product.supplier.companyName,
        clientName: clientName,
        productName: product.name,
        productSubtitle: product.subtitle,
        productImage: product.image,
        quantity: quantity,
        variations: estimateProductVariations.map((variation) => {
          return {
            variation: variation.variation.name,
            variationOption: variation.variationOption.name,
          };
        }),
      });
    } catch (error) {}
  }
}
