import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import type { IReportStorage } from '../../application/ports/report-storage.port';

@Injectable()
export class R2StorageService implements IReportStorage {
  private readonly client: S3Client;
  private readonly bucket: string;

  constructor(private readonly config: ConfigService) {
    const accountId = this.config.get<string>('R2_ACCOUNT_ID');
    const accessKeyId = this.config.get<string>('R2_ACCESS_KEY_ID');
    const secretAccessKey = this.config.get<string>('R2_SECRET_ACCESS_KEY');
    this.bucket = this.config.get<string>('R2_BUCKET') ?? 'reports';

    const endpoint =
      accountId != null && accountId !== ''
        ? `https://${accountId}.r2.cloudflarestorage.com`
        : this.config.get<string>('R2_ENDPOINT') ?? '';

    this.client = new S3Client({
      region: this.config.get<string>('R2_REGION') ?? 'auto',
      endpoint,
      credentials:
        accessKeyId != null &&
        accessKeyId !== '' &&
        secretAccessKey != null &&
        secretAccessKey !== ''
          ? { accessKeyId, secretAccessKey }
          : undefined,
      forcePathStyle: true,
    });
  }

  async put(key: string, body: Buffer, contentType: string): Promise<void> {
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: body,
        ContentType: contentType,
      }),
    );
  }

  async get(
    key: string,
  ): Promise<{ body: Buffer; contentType: string }> {
    const response = await this.client.send(
      new GetObjectCommand({
        Bucket: this.bucket,
        Key: key,
      }),
    );
    if (response.Body == null) {
      throw new Error(`Object not found: ${key}`);
    }
    const chunks: Uint8Array[] = [];
    for await (const chunk of response.Body as AsyncIterable<Uint8Array>) {
      chunks.push(chunk);
    }
    const body = Buffer.concat(chunks);
    const contentType =
      (response.ContentType as string) ?? 'application/octet-stream';
    return { body, contentType };
  }
}
