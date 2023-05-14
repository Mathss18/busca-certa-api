import { OnEvent } from '@nestjs/event-emitter';
import { EstimateCreatedEventType } from '../events/estimate-created.event';
import { Injectable } from '@nestjs/common';
import { EstimateRepository } from '../estimate.repository';
import { MailService } from '../../../mail/mail.service';

@Injectable()
export class EstimateListener {
  constructor(private readonly repository: EstimateRepository, private readonly mailService: MailService) {}

  @OnEvent('estimate.created')
  async sendEstimateToClientEmail(event: EstimateCreatedEventType) {
    try {
      const estimate = await this.repository.findWithVariationsAndEstimateInfo(event.estimateId);
      const { clientName, clientEmail, product, quantity, clientMessage, estimateProductVariations } = estimate;
      this.mailService.sendEmailWithTemplate(clientEmail, 'Orçamento Recebido!', './new-estimate-received', {
        supplierName: product.supplier.companyName,
        clientName: clientName,
        productName: product.name,
        productImage: product.image,
        quantity: quantity,
        variations: estimateProductVariations.map((variation) => {
          return {
            variation: variation.variation.name,
            variationOption: variation.variationOption.name,
          };
        }),
        clientMessage: clientMessage,
        reviewLink: 'https://google.com',
      });

      console.log('Sending estimate to client email', clientEmail);
    } catch (error) {
      console.log(error);
    }
  }
}
