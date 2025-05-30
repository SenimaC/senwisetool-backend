// s3.service.ts
import {
  CreateBucketCommand,
  HeadBucketCommand,
  PutBucketPolicyCommand,
  PutObjectCommand,
  PutPublicAccessBlockCommand,
  S3Client,
} from '@aws-sdk/client-s3';

// import { GetObjectCommand } from '@aws-sdk/client-s3';
// import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { uniqueString } from 'src/common/helpers/string-generator';

@Injectable()
export class S3Service {
  private s3: S3Client;
  private readonly region: string;

  constructor(private configService: ConfigService) {
    this.region = this.configService.get<string>('AWS_REGION');

    this.s3 = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      },
    });
  }

  async createBucket(companyName?: string): Promise<string> {
    let bucketName: string;
    let exists = true;

    do {
      bucketName = uniqueString(companyName);

      try {
        await this.s3.send(new HeadBucketCommand({ Bucket: bucketName }));
        Logger.warn(
          `❌ Le bucket ${bucketName} existe déjà. On en génère un autre...`,
        );
      } catch {
        exists = false;
      }
    } while (exists);

    // Créer le bucket maintenant que le nom est libre
    await this.s3.send(new CreateBucketCommand({ Bucket: bucketName }));
    Logger.log(`✅ Bucket créé : ${bucketName}`);

    // Désactiver le blocage des accès publics
    await this.s3.send(
      new PutPublicAccessBlockCommand({
        Bucket: bucketName,
        PublicAccessBlockConfiguration: {
          BlockPublicAcls: false,
          IgnorePublicAcls: false,
          BlockPublicPolicy: false,
          RestrictPublicBuckets: false,
        },
      }),
    );
    Logger.log(`🔓 Accès public activé sur le bucket : ${bucketName}`);

    // Ajouter une policy pour autoriser la lecture publique des objets
    const publicPolicy = {
      Version: '2012-10-17',
      Statement: [
        {
          Sid: 'PublicReadGetObject',
          Effect: 'Allow',
          Principal: '*',
          Action: 's3:GetObject',
          Resource: `arn:aws:s3:::${bucketName}/*`,
        },
      ],
    };

    await this.s3.send(
      new PutBucketPolicyCommand({
        Bucket: bucketName,
        Policy: JSON.stringify(publicPolicy),
      }),
    );
    Logger.log(`📜 Policy publique appliquée sur le bucket : ${bucketName}`);

    return bucketName;
  }

  async uploadFile(
    file: Express.Multer.File,
    bucketName: string,
    folder?: string,
  ): Promise<string> {
    const uniqFileName = uniqueString(file.originalname);
    const fileName = folder ? `${folder}/uniqFileName` : uniqFileName;

    await this.s3.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    const logoUrl = `https://${bucketName}.s3.${this.region}.amazonaws.com/${fileName}`;

    Logger.log(`✅ Logo de la compagnie uploadé avec success : ${logoUrl}`);
    return logoUrl;
  }
}
