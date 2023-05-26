import { OnEvent } from '@nestjs/event-emitter';
import { EstimateCreatedEventType } from '../events/estimate-created.event';
import { Injectable } from '@nestjs/common';
import { EstimateRepository } from '../estimate.repository';
import { MailService } from '../../../mail/mail.service';
import { ConfigService } from '@nestjs/config';
import { EstimatesTimelineService } from '../../estimates-timeline/estimates-timeline.service';
import { EstimateTimelineCode } from '../../estimates-timeline/enum/estimate-timeline.enum';
import { WhatsappService } from '../../../whatsapp/whatsapp.service';

@Injectable()
export class EstimateCreatedListener {
  constructor(
    private readonly repository: EstimateRepository,
    private readonly mailService: MailService,
    private readonly whatsappService: WhatsappService,
    private readonly configService: ConfigService,
    private readonly estimatesTimelineService: EstimatesTimelineService,
  ) {}

  @OnEvent('estimate.created')
  async notifySupplier(event: EstimateCreatedEventType) {
    try {
      const estimate = await this.repository.findWithVariationsAndEstimateInfo(event.estimateId);
      this.sendEmailToSupplier(estimate);
      this.sendWhatsappToSupplier(estimate);
    } catch (error) {
      console.log(error);
    }
  }

  @OnEvent('estimate.created')
  async notifyClient(event: EstimateCreatedEventType) {
    const estimate = await this.repository.findWithVariationsAndEstimateInfo(event.estimateId);
    this.sendEmailToClient(estimate);
  }

  @OnEvent('estimate.created')
  addEventTimeline(event: EstimateCreatedEventType) {
    this.estimatesTimelineService.create({
      estimateId: event.estimateId,
      code: EstimateTimelineCode.Events.CREATED.CODE,
      message: EstimateTimelineCode.Events.CREATED.MESSAGE,
    });
  }

  private sendEmailToSupplier(estimate) {
    const { id, clientName, product, quantity, clientMessage, estimateProductVariations, nonce, clientFile } = estimate;

    const attachments = clientFile ? [{ url: clientFile }] : null;

    const data = {
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
      clientFile: !!clientFile,
      clientMessage: clientMessage,
      reviewLink: `${this.configService.get('websiteUrl')}/estimates/review?nonce=${nonce}`,
    };

    try {
      this.mailService.sendEmailWithTemplate(
        product.supplier.email,
        'Orçamento Recebido!',
        './estimate-created-to-supplier',
        data,
        undefined,
        attachments,
      );
    } catch (error) {}
  }

  private async sendWhatsappToSupplier(estimate) {
    const { id, product, quantity } = estimate;
    try {
      const to = `55${product.supplier.mobileNumber}`;
      await this.whatsappService.sendTemplateMessage(to, {
        name: 'estimate_created_to_supplier',
        language: {
          code: 'pt_BR',
        },
        components: [
          {
            type: 'body',
            parameters: [
              {
                type: 'text',
                text: product.supplier.companyName,
              },
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

  private sendEmailToClient(estimate) {
    const { id, clientName, clientEmail, product, quantity, estimateProductVariations } = estimate;

    try {
      this.mailService.sendEmailWithTemplate(clientEmail, 'Orçamento Enviado!', './estimate-created-to-client', {
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
