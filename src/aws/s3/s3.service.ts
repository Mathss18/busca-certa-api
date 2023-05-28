import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export enum Folder {
  ATTACHMENTS = 'attachments',
  PRODUCTS = 'products',
  SUPPLIERS = 'suppliers',
  WEBSITE = 'website',
  PRODUCTS_CATEGORY = 'products-category',
}

@Injectable()
export class S3Service {
  private readonly s3Client: S3Client;
  private readonly bucketName = 'busca-certa-bucket';
  constructor(private readonly configService: ConfigService) {
    this.s3Client = new S3Client({
      region: this.configService.get('aws.region'),
      credentials: {
        accessKeyId: this.configService.get('aws.accessKeyId'),
        secretAccessKey: this.configService.get('aws.secretAccessKey'),
      },
    });
  }

  async upload(filename: string, file: Buffer, folder: Folder): Promise<string> {
    const filePath = `${folder}/${filename}`;

    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.bucketName,
        Key: filePath, // use the new filePath here
        Body: file,
        ACL: 'public-read',
      }),
    );

    return `https://${this.bucketName}.s3.${this.configService.get('aws.region')}.amazonaws.com/${filePath}`;
  }

  async delete(filename: string): Promise<void> {
    await this.s3Client.send(
      new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: filename,
      }),
    );
  }
}
