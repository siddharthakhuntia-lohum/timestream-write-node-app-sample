import { s3Client } from "../aws-clients.js";

var s3ErrorReportBucketName = null;

async function createS3Bucket(bucketName) {
  console.log("Creating S3 bucket for error reporting");
  const params = {
    Bucket: bucketName,
  };

  try {
    const data = await s3Client.createBucket(params).promise();
    console.log("Bucket Created Successfully", data.Location);
    s3ErrorReportBucketName = bucketName;
    return bucketName;
  } catch (err) {
    if (err.statusCode === 409) {
      console.log("Bucket has been created already");
      s3ErrorReportBucketName = bucketName;
      return bucketName;
    } else {
      console.log("S3 bucket creation failed" + err);
      throw err;
    }
  }
}

async function deleteS3Bucket() {
  console.log("Deleting S3 Bucket");
  if (s3ErrorReportBucketName == null) {
    console.log("No S3 Bucket needs to be deleted");
    return;
  }
  const params = {
    Bucket: s3ErrorReportBucketName,
  };
  try {
    const data = await s3Client.deleteBucket(params).promise();
    console.log("Bucket deleted Successfully");
  } catch (err) {
    console.log("Deletion of S3 error report bucket failed: ", err);
  }
}

async function clearBucket() {
  console.log("Clearing Bucket");
  var self = this;
  try {
    const data = await s3Client
      .listObjects({ Bucket: s3ErrorReportBucketName })
      .promise();
    var items = data.Contents;
    for (var i = 0; i < items.length; i += 1) {
      var deleteParams = { Bucket: s3ErrorReportBucketName, Key: items[i].Key };
      await self.deleteObject(deleteParams);
    }
  } catch (err) {
    console.log("error listing bucket objects " + err);
  }
}

async function deleteObject(deleteParams) {
  try {
    const data = await s3Client.deleteObject(deleteParams).promise();
    console.log(deleteParams.Key + " deleted");
  } catch (err) {
    console.log("Object deletion failed");
  }
}

async function getS3ErrorReportBucketName() {
  return s3ErrorReportBucketName;
}

export {
  createS3Bucket,
  deleteS3Bucket,
  clearBucket,
  deleteObject,
  getS3ErrorReportBucketName,
};
