import { TimestreamWriteClient } from "@aws-sdk/client-timestream-write";
import { S3Client } from "@aws-sdk/client-s3";
import { config } from "dotenv";

config();

const AWS_REGION = process.env.AWS_REGION;
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const AWS_S3_BUCKET_REGION = process.env.AWS_S3_BUCKET_REGION;

export const writeClient = new TimestreamWriteClient({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
  maxAttempts: 10,
  // requestHandler: agent
});

export const s3Client = new S3Client({ region: AWS_S3_BUCKET_REGION });
