import {
  DATABASE_NAME,
  TABLE_NAME,
  SQ_ERROR_CONFIGURATION_S3_BUCKET_NAME,
} from "./constants.js";

import * as crudAndSimpleIngestionExample from "./utils/crud-ingestion.js";
import * as csvIngestExample from "./utils/csv-ingestion.js";
import * as timestreamDependencyHelper from "./utils/s3-helper.js";

const csvFilePath = "sample.csv";

async function writeRecordsExample() {
  if (csvFilePath != null) {
    await csvIngestExample.processCSV(csvFilePath);
  }
}

async function createAndUpdateDatabaseExamples() {
  await crudAndSimpleIngestionExample.createDatabase(DATABASE_NAME);
  await crudAndSimpleIngestionExample.describeDatabase();
  await crudAndSimpleIngestionExample.listDatabases();
  await timestreamDependencyHelper.createS3Bucket(
    SQ_ERROR_CONFIGURATION_S3_BUCKET_NAME
  );
  await crudAndSimpleIngestionExample.createTable(DATABASE_NAME, TABLE_NAME);
  await crudAndSimpleIngestionExample.describeTable();
  await crudAndSimpleIngestionExample.listTables();
  await crudAndSimpleIngestionExample.updateTable();
}

(async () => {
  try {
    await createAndUpdateDatabaseExamples();
    await writeRecordsExample();
  } catch (err) {
    console.log("Error: ", err);
  } finally {
    await crudAndSimpleIngestionExample.deleteTable(DATABASE_NAME, TABLE_NAME);
    await crudAndSimpleIngestionExample.deleteDatabase(DATABASE_NAME);
  }
})();
