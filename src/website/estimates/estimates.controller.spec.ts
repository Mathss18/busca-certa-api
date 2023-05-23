import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';
import { EstimatesController } from './estimates.controller';
import { EstimatesService } from './estimates.service';
import { S3Service } from '../../aws/s3/s3.service';
import { CreateEstimateDto, AcceptEstimateDto, DeclineEstimateDto } from './dto/estimate.dto';
import { HttpReturn } from '../../shared/http-response';
import { HttpStatus } from '@nestjs/common';
import { EstimateRepository } from './estimate.repository';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../database/prisma.service';

describe('EstimatesController', () => {
  let controller: EstimatesController;
  let service: EstimatesService;
  let s3Service: S3Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EstimatesController],
      providers: [EstimatesService, S3Service, EstimateRepository, EventEmitter2, ConfigService, PrismaService],
    }).compile();

    controller = module.get<EstimatesController>(EstimatesController);
    service = module.get<EstimatesService>(EstimatesService);
    s3Service = module.get<S3Service>(S3Service);
  });

  describe('create', () => {
    const mockClientFile: Express.Multer.File | any = {
      fieldname: 'clientFile',
      originalname: 'test.pdf',
      encoding: '7bit',
      mimetype: 'application/pdf',
      destination: '',
      filename: 'test.pdf',
      path: '',
      size: 1000,
      buffer: Buffer.from('test', 'utf-8'),
    };
    const mockCreateEstimateDto: CreateEstimateDto = {
      clientName: 'John Doe',
      clientEmail: 'john@example.com',
      clientPhone: '1234567890',
      clientCompanyName: 'ACME Inc.',
      productId: 1,
      quantity: 2,
    };
    const mockResponse: Partial<Response> = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    it('should create an estimate with client file', async () => {
      jest.spyOn(s3Service, 'upload').mockResolvedValue('file-url');
      jest.spyOn(service, 'create').mockResolvedValue({ id: 1 });

      await controller.create(mockClientFile, mockCreateEstimateDto, mockResponse as Response);

      expect(s3Service.upload).toHaveBeenCalled();
      expect(service.create).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockResponse.json).toHaveBeenCalledWith(
        HttpReturn.build({
          data: { id: 1 },
        }),
      );
    });

    it('should create an estimate without client file', async () => {
      jest.spyOn(service, 'create').mockResolvedValue({ id: 1 });
      jest.spyOn(s3Service, 'upload').mockResolvedValue('file-url');

      await controller.create(null, mockCreateEstimateDto, mockResponse as Response);

      expect(s3Service.upload).not.toHaveBeenCalled();
      expect(service.create).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockResponse.json).toHaveBeenCalledWith(
        HttpReturn.build({
          data: { id: 1 },
        }),
      );
    });

    it('should handle errors during estimate creation', async () => {
      jest.spyOn(s3Service, 'upload').mockRejectedValue(new Error('Upload failed'));
      jest.spyOn(s3Service, 'delete').mockResolvedValue();
      jest.spyOn(service, 'create').mockRejectedValue(new Error('Creation failed'));

      await controller.create(mockClientFile, mockCreateEstimateDto, mockResponse as Response);

      expect(s3Service.upload).toHaveBeenCalled();
      expect(s3Service.delete).toHaveBeenCalled();
      expect(service.create).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(mockResponse.json).toHaveBeenCalledWith(HttpReturn.build({ success: false, data: {}, message: 'Upload failed' }));
    });
  });

  describe('ackEstimate', () => {
    const mockNonce = 'nonce';
    const mockResponse: Partial<Response> = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    it('should acknowledge an estimate', async () => {
      jest.spyOn(service, 'ackEstimate').mockResolvedValue('ack');

      await controller.ackEstimate(mockNonce, mockResponse as Response);

      expect(service.ackEstimate).toHaveBeenCalledWith(mockNonce);
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockResponse.json).toHaveBeenCalledWith(
        HttpReturn.build({
          data: 'ack',
        }),
      );
    });

    it('should handle errors during acknowledgment', async () => {
      jest.spyOn(service, 'ackEstimate').mockRejectedValue(new Error('Acknowledgment failed'));

      await controller.ackEstimate(mockNonce, mockResponse as Response);

      expect(service.ackEstimate).toHaveBeenCalledWith(mockNonce);
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(mockResponse.json).toHaveBeenCalledWith(
        HttpReturn.build({
          success: false,
          message: 'Acknowledgment failed',
        }),
      );
    });
  });

  describe('getByNonce', () => {
    const mockNonce = 'nonce';
    const mockResponse: Partial<Response> = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    it('should get an estimate by nonce', async () => {
      jest.spyOn(service, 'getOneByNonce').mockResolvedValue({ id: 1 } as any);

      await controller.getByNonce(mockNonce, mockResponse as Response);

      expect(service.getOneByNonce).toHaveBeenCalledWith(mockNonce);
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockResponse.json).toHaveBeenCalledWith(
        HttpReturn.build({
          data: { id: 1 },
        }),
      );
    });

    it('should handle errors during getting an estimate', async () => {
      jest.spyOn(service, 'getOneByNonce').mockRejectedValue(new Error('Get estimate failed'));

      await controller.getByNonce(mockNonce, mockResponse as Response);

      expect(service.getOneByNonce).toHaveBeenCalledWith(mockNonce);
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(mockResponse.json).toHaveBeenCalledWith(
        HttpReturn.build({
          success: false,
          message: 'Get estimate failed',
        }),
      );
    });
  });

  describe('accept', () => {
    const mockAcceptEstimateDto: AcceptEstimateDto = {
      nonce: 'nonce',
      price: 100,
    };
    const mockResponse: Partial<Response> = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    it('should accept an estimate', async () => {
      jest.spyOn(service, 'accept').mockResolvedValue({ id: 1 } as any);

      await controller.accept(mockAcceptEstimateDto, mockResponse as Response);

      expect(service.accept).toHaveBeenCalledWith(mockAcceptEstimateDto);
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockResponse.json).toHaveBeenCalledWith(
        HttpReturn.build({
          data: { id: 1 },
        }),
      );
    });

    it('should handle errors during accepting an estimate', async () => {
      jest.spyOn(service, 'accept').mockRejectedValue(new Error('Acceptance failed'));

      await controller.accept(mockAcceptEstimateDto, mockResponse as Response);

      expect(service.accept).toHaveBeenCalledWith(mockAcceptEstimateDto);
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(mockResponse.json).toHaveBeenCalledWith(
        HttpReturn.build({
          success: false,
          message: 'Acceptance failed',
        }),
      );
    });
  });

  describe('decline', () => {
    const mockDeclineEstimateDto: DeclineEstimateDto = {
      nonce: 'nonce',
      reason: 'Out of budget',
    };
    const mockResponse: Partial<Response> = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    it('should decline an estimate', async () => {
      jest.spyOn(service, 'decline').mockResolvedValue({ id: 1 } as any);

      await controller.decline(mockDeclineEstimateDto, mockResponse as Response);

      expect(service.decline).toHaveBeenCalledWith(mockDeclineEstimateDto);
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockResponse.json).toHaveBeenCalledWith(
        HttpReturn.build({
          data: { id: 1 },
        }),
      );
    });

    it('should handle errors during declining an estimate', async () => {
      jest.spyOn(service, 'decline').mockRejectedValue(new Error('Decline failed'));

      await controller.decline(mockDeclineEstimateDto, mockResponse as Response);

      expect(service.decline).toHaveBeenCalledWith(mockDeclineEstimateDto);
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(mockResponse.json).toHaveBeenCalledWith(
        HttpReturn.build({
          success: false,
          message: 'Decline failed',
        }),
      );
    });
  });
});
