import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { S3Service } from './s3.service';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

jest.mock('@aws-sdk/client-s3');

describe('S3Service', () => {
  let service: S3Service;
  let configService: ConfigService;
  let s3Client: S3Client;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [S3Service, ConfigService, S3Client],
    }).compile();

    service = module.get<S3Service>(S3Service);
    configService = module.get<ConfigService>(ConfigService);
    s3Client = module.get<S3Client>(S3Client);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should upload a file to S3', async () => {
    const filename = 'test.txt';
    const file = Buffer.from('test file');
    const region = 'us-east-1';
    const bucketName = 'busca-certa-bucket';

    jest.spyOn(configService, 'get').mockImplementation((key: string) => {
      switch (key) {
        case 'aws.region':
          return region;
        default:
          return null;
      }
    });

    jest.spyOn(s3Client, 'send').mockImplementation(async (command) => {
      if (command instanceof PutObjectCommand) {
        // Mock the PutObjectCommand response
        return {}; // Return an empty object or customize as needed
      } else {
        throw new Error('Invalid command');
      }
    });

    const expectedUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${filename}`;

    expect(await service.upload(filename, file)).toEqual(expectedUrl);
    expect(s3Client.send).toHaveBeenCalledWith(expect.any(PutObjectCommand));
  });

  it('should delete a file from S3', async () => {
    const filename = 'test.txt';
    const bucketName = 'busca-certa-bucket';

    jest.spyOn(s3Client, 'send').mockImplementation(async (command) => {
      if (command instanceof DeleteObjectCommand) {
        // Mock the DeleteObjectCommand response
        return {}; // Return an empty object or customize as needed
      } else {
        throw new Error('Invalid command');
      }
    });

    await service.delete(filename);

    expect(s3Client.send).toHaveBeenCalledWith(expect.any(DeleteObjectCommand));
  });
});
