import {
  DATABASE_NAME,
  TABLE_NAME,
  SQ_ERROR_CONFIGURATION_S3_BUCKET_NAME,
} from "./constants.js";

import * as timestreamSetupHelper from "./utils/timestreamSetup.js";
import * as csvIngestion from "./utils/csv-ingestion.js";
import * as s3Helper from "./utils/s3-helper.js";
import { writeClient } from "./aws-clients.js";

const csvFilePath = "sample.csv";

async function writeRecordsFromCSV() {
  if (csvFilePath != null) {
    await csvIngestion.processCSV(csvFilePath);
  }
}

async function createDatabase() {
  await timestreamSetupHelper.createDatabase(DATABASE_NAME);
  await timestreamSetupHelper.describeDatabase();
  await timestreamSetupHelper.listDatabases();
  await s3Helper.createS3Bucket(SQ_ERROR_CONFIGURATION_S3_BUCKET_NAME);
  await timestreamSetupHelper.createTable(DATABASE_NAME, TABLE_NAME);
  await timestreamSetupHelper.describeTable();
  await timestreamSetupHelper.listTables();
  await timestreamSetupHelper.updateTable();
}

async function writeRecord(
  data,
  tableName,
  measureName,
  measureValue,
  measureValueType
) {
  //TODO: Data cleanup
  //TODO: Check if database and table exists
  const dimensions = [
    {
      Name: "batteryNumber",
      Value: data.batteryNumber.toString(),
    },
    {
      Name: "batteryType",
      Value: data.batteryType.toString(),
    },
    {
      Name: "batteryModel",
      Value: data.batteryModel.toString(),
    },
    {
      Name: "deviceIMEI",
      Value: data.deviceIMEI.toString(),
    },
    {
      Name: "deviceIP",
      Value: data.deviceIP.toString(),
    },
  ];

  const recordTime = data.recordTime.toString();

  const records = [
    {
      Dimensions: dimensions,
      MeasureName: measureName,
      MeasureValue: measureValue,
      MeasureValueType: measureValueType,
      Time: recordTime,
    },
  ];

  const params = {
    DatabaseName: DATABASE_NAME,
    TableName: tableName,
    Records: records,
  };

  var promise = writeClient.writeRecords(params).promise();

  return promise.then(
    () => {},
    (err) => {
      console.log("Error writing record:", err);
    }
  );
}

export {
    writeRecordsFromCSV,
    createDatabase,
    writeRecord,
}