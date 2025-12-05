import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

// Singleton S3 client instance
const s3Client = new S3Client({
  region: process.env.AWS_REGION || "ap-southeast-2",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const bucketName = process.env.AWS_S3_BUCKET_NAME || "your-bucket-name";

/**
 * Get the S3 client instance
 */
export const getS3Client = (): S3Client => {
  return s3Client;
};

/**
 * Get the S3 bucket name
 */
export const getBucketName = (): string => {
  return bucketName;
};

/**
 * Delete an object from S3
 */
export const deleteObject = async (key: string): Promise<void> => {
  const deleteCommand = new DeleteObjectCommand({
    Bucket: bucketName,
    Key: key,
  });
  await s3Client.send(deleteCommand);
};
