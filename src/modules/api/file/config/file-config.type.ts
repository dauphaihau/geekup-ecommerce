export enum FileStorageDriver {
  Local = 'local',
  S3 = 's3',
  S3_Presigned = 's3-presigned',
}

export type FileStorageConfig = {
  driver: FileStorageDriver;
  awsAccessKeyId?: string;
  awsSecretAccessKey?: string;
  awsS3Bucket?: string;
  awsS3Region?: string;
  maxFileSize: number;
};
