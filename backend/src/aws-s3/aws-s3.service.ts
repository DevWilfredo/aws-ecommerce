import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import type { Multer } from 'multer';

@Injectable()
export class AwsS3Service {
    private s3: S3Client;
    private bucket: string;
    private prefix: string;

    constructor(private config: ConfigService) {
        this.bucket = this.config.get<string>('AWS_S3_BUCKET') || '';
        this.prefix = this.config.get<string>('AWS_S3_UPLOAD_PREFIX') || '';
        this.s3 = new S3Client({
            region: this.config.get<string>('AWS_REGION') || '',
            credentials: {
                accessKeyId: this.config.get<string>('AWS_ACCESS_KEY_ID') || '',
                secretAccessKey: this.config.get<string>('AWS_SECRET_ACCESS_KEY') || '',
            },
        });
    }

    private buildKey(fileName: string, folder?: string) {
        const normalizedPrefix = this.prefix ? `${this.prefix}/` : '';
        const normalizedFolder = folder ? `${folder.replace(/^\//, '').replace(/\/$/, '')}/` : '';
        return `${normalizedPrefix}${normalizedFolder}${randomUUID()}-${fileName}`;
    }

    async uploadFile(
        file: Multer.File,
        folder?: string,
    ): Promise<{ url: string; key: string }> {
        const key = this.buildKey(file.originalname, folder);

        await this.s3.send(
            new PutObjectCommand({
                Bucket: this.bucket,
                Key: key,
                Body: file.buffer,
                ContentType: file.mimetype,
            }),
        );

        const url = `https://${this.bucket}.s3.${this.config.get<string>('AWS_REGION')}.amazonaws.com/${key}`;
        return { url, key };
    }

    async uploadFiles(
        files: Multer.File[],
        folder?: string,
    ): Promise<{ url: string; key: string }[]> {
        return Promise.all(files.map((file) => this.uploadFile(file, folder)));
    }

    async deleteFile(key: string) {
        await this.s3.send(
            new DeleteObjectCommand({
                Bucket: this.bucket,
                Key: key
            })
        )
    }

    async deleteFiles(keys: string[]) {
        await Promise.all(keys.map((key) => this.deleteFile(key)));
    }
}
