import {
  DATABASE_NAME,
  TABLE_NAME,
  SQ_ERROR_CONFIGURATION_S3_BUCKET_NAME,
} from "./constants.js";

import * as crudIngestionHelper from "./utils/crud-ingestion.js";
import * as csvIngestion from "./utils/csv-ingestion.js";
import * as s3Helper from "./utils/s3-helper.js";

const csvFilePath = "sample.csv";

async function writeRecordsExample() {
  if (csvFilePath != null) {
    await csvIngestion.processCSV(csvFilePath);
  }
}

async function createAndUpdateDatabaseExamples() {
  await crudIngestionHelper.createDatabase(DATABASE_NAME);
  await crudIngestionHelper.describeDatabase();
  await crudIngestionHelper.listDatabases();
  await s3Helper.createS3Bucket(SQ_ERROR_CONFIGURATION_S3_BUCKET_NAME);
  await crudIngestionHelper.createTable(DATABASE_NAME, TABLE_NAME);
  await crudIngestionHelper.describeTable();
  await crudIngestionHelper.listTables();
  await crudIngestionHelper.updateTable();
}

(async () => {
  try {
    await createAndUpdateDatabaseExamples();
    await writeRecordsExample();
  } catch (err) {
    console.log("Error: ", err);
  } finally {
    await crudIngestionHelper.deleteTable(DATABASE_NAME, TABLE_NAME);
    await crudIngestionHelper.deleteDatabase(DATABASE_NAME);
  }
})();
