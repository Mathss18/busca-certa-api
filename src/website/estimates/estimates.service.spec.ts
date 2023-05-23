import { EstimateRepository } from './estimate.repository';
import { CreateEstimateDto } from './dto/estimate.dto';
import { PrismaService } from '../../database/prisma.service';

describe('EstimateRepository', () => {
  let estimateRepository: EstimateRepository;

  beforeEach(() => {
    estimateRepository = new EstimateRepository(new PrismaService());
  });

  describe('create', () => {
    it('should create a new estimate', async () => {
      const createEstimateDto: CreateEstimateDto = {
        clientName: 'John Doe',
        clientEmail: 'john.doe@example.com',
        clientPhone: '1234567890',
        clientCompanyName: 'ABC Company',
        clientSegment: 'Segment',
        clientFile: 'file.pdf',
        clientMessage: 'Test message',
        productId: 1,
        quantity: 5,
        estimateProductVariations: [
          { variationId: 1, variationOptionId: 1 },
          { variationId: 2, variationOptionId: 2 },
        ],
      };

      const createdEstimate = await estimateRepository.create(createEstimateDto);

      expect(createdEstimate).toBeDefined();
    });
  });
});
