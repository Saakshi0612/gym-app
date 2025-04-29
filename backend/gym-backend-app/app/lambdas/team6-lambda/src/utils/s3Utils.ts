import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: "ap-southeast-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
  }
});

export const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB (reduced from 5MB)
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];
export const ALLOWED_CERTIFICATE_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];

export function validateFile(file: Buffer, type: 'image' | 'certificate', mimeType: string): boolean {
  if (file.length > MAX_FILE_SIZE) return false;
  
  if (type === 'image' && !ALLOWED_IMAGE_TYPES.includes(mimeType)) return false;
  if (type === 'certificate' && !ALLOWED_CERTIFICATE_TYPES.includes(mimeType)) return false;
  
  return true;
}

export async function uploadToS3(file: Buffer, key: string, contentType: string): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: "team6-backend-bucket-dev1",
    Key: key,
    Body: file,
    ContentType: contentType
  });
  
  await s3Client.send(command);
  return `https://team6-backend-bucket-dev1.s3.ap-southeast-1.amazonaws.com/${key}`;
}

export async function deleteFromS3(key: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: "team6-backend-bucket-dev1",
    Key: key
  });
  
  await s3Client.send(command);
}

export function getFileKeyFromUrl(url: string): string {
  return url.split('/').pop() || '';
} 