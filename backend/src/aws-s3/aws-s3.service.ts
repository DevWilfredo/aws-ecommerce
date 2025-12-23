import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';

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

    async uploadFile(file: Express.Multer.File): Promise<{ url: string, key: string }> {
        const key = `${this.prefix}/${randomUUID()}-${file.originalname}`;

        await this.s3.send(
            new PutObjectCommand({
                Bucket: this.bucket,
                Key: key,
                Body: file.buffer,
                ContentType: file.mimetype,
                ACL: 'public-read',
            }),
        );

        const url = `https://${this.bucket}.s3.${this.config.get<string>('AWS_REGION')}.amazonaws.com/${key}`;
        return { url, key };
    }


    async deleteFile(key: string) {
        await this.s3.send(
            new DeleteObjectCommand({
                Bucket: this.bucket,
                Key: key
            })
        )
    }
}
