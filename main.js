const AWS = require("aws-sdk");
const constants = require("./constants");

const crudAndSimpleIngestionExample = require("./utils/crud-ingestion");
const csvIngestExample = require("./utils/csv-ingestion");
const timestreamDependencyHelper = require("./utils/s3-helper");

var csvFilePath = "sample.csv";
var AWSregion = "us-east-1";

AWS.config.update({ region: AWSregion });

var https = require("https");
var agent = new https.Agent({
  maxSockets: 5000,
});
writeClient = new AWS.TimestreamWrite({
  maxRetries: 10,
  httpOptions: {
    timeout: 20000,
    agent: agent,
  },
});

s3Client = new AWS.S3({ apiVersion: "2006-03-01" });

async function writeRecordsExample() {
  if (csvFilePath != null) {
    await csvIngestExample.processCSV(csvFilePath);
  }
}

async function createAndUpdateDatabaseExamples() {
  await crudAndSimpleIngestionExample.createDatabase(constants.DATABASE_NAME);
  await crudAndSimpleIngestionExample.describeDatabase();
  await crudAndSimpleIngestionExample.listDatabases();
  s3ErrorReportBucketName = await timestreamDependencyHelper.createS3Bucket(
    constants.SQ_ERROR_CONFIGURATION_S3_BUCKET_NAME
  );
  await crudAndSimpleIngestionExample.createTable(
    constants.DATABASE_NAME,
    constants.TABLE_NAME
  );
  await crudAndSimpleIngestionExample.describeTable();
  await crudAndSimpleIngestionExample.listTables();
  await crudAndSimpleIngestionExample.updateTable();
}

(async () => {
  try {
    var s3ErrorReportBucketName = null;
    await createAndUpdateDatabaseExamples();
    await writeRecordsExample();
  } catch (err) {
    console.log("Error: ", err);
  } finally {
    await crudAndSimpleIngestionExample.deleteTable(
      constants.DATABASE_NAME,
      constants.TABLE_NAME
    );
    await crudAndSimpleIngestionExample.deleteDatabase(constants.DATABASE_NAME);
  }
})();
