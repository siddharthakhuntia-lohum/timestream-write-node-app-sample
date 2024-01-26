import AWS from "aws-sdk";
import https from "https";

const AWSregion = "us-east-1";

AWS.config.update({ region: AWSregion });

const agent = new https.Agent({
  maxSockets: 5000,
});


export const writeClient = new AWS.TimestreamWrite({
  maxRetries: 10,
  httpOptions: {
    timeout: 20000,
    agent: agent,
  },
});

export const s3Client = new AWS.S3({ apiVersion: "2006-03-01" });