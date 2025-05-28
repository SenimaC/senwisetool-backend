// s3.service.ts
import {
  CreateBucketCommand,
  HeadBucketCommand,
  PutBucketAclCommand,
  PutBucketPolicyCommand,
  PutObjectCommand,
  PutPublicAccessBlockCommand,
  S3Client,
} from '@aws-sdk/client-s3';

// import { GetObjectCommand } from '@aws-sdk/client-s3';
// import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { uniqueString } from 'src/utils/tools';

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

  // Fonction pour désactiver l'accès public
  private disablePublicAccess = async (bucketName: string) => {
    try {
      const params = {
        Bucket: bucketName,
        ACL: 'private' as const, // Désactiver l'accès public en définissant ACL à "private"
      };

      const command = new PutBucketAclCommand(params);
      await this.s3.send(command);
      console.log('Public access disabled successfully');
    } catch (error) {
      console.error('Error disabling public access:', error);
      throw error;
    }
  };

  // Fonction pour désactiver le blocage de l'accès public
  private disablePublicAccessBlock = async (bucketName: string) => {
    try {
      const params = {
        Bucket: bucketName,
        PublicAccessBlockConfiguration: {
          BlockPublicAcls: false, // Ne pas bloquer les ACL publiques
          IgnorePublicAcls: false, // Ne pas ignorer les ACL publiques
          BlockPublicPolicy: false, // Ne pas bloquer les politiques publiques
          RestrictPublicBuckets: false, // Ne pas restreindre les buckets publics
        },
      };

      const command = new PutPublicAccessBlockCommand(params);
      await this.s3.send(command);
      return { data: true };
    } catch (error) {
      return { error: error };
    }
  };

  // Fonction pour mettre à jour la politique du bucket
  private updateBucketPolicy = async (bucketName: string) => {
    const bucketPolicy = {
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Principal: '*',
          Action: 's3:GetObject',
          Resource: `arn:aws:s3:::${bucketName}/*`,
        },
      ],
    };

    try {
      const params = {
        Bucket: bucketName,
        Policy: JSON.stringify(bucketPolicy),
      };

      const command = new PutBucketPolicyCommand(params);
      await this.s3.send(command);
      return { data: true };
    } catch (error) {
      return { error: error };
    }
  };

  // Générer une URL signée pour accéder à un fichier
  // getSignedFileUrl = async (bucketName: string, key: string, delay: number) => {
  //   try {
  //     const command = new GetObjectCommand({
  //       Bucket: bucketName,
  //       Key: key,
  //     });

  //     // URL signée avec expiration de 1 heure (vous pouvez ajuster cela)
  //     const signedUrl = await getSignedUrl(this.s3, command, {
  //       expiresIn: delay,
  //     });
  //     return signedUrl;
  //   } catch (error) {
  //     console.error('Error generating signed URL:', error);
  //     throw error;
  //   }
  // };
}
