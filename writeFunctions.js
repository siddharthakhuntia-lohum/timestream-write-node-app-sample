import {
  DATABASE_NAME,
  TABLE_NAME,
  SQ_ERROR_CONFIGURATION_S3_BUCKET_NAME,
} from "./constants.js";

import * as timestreamSetupHelper from "./utils/timestreamSetup.js";
import * as csvIngestion from "./utils/csv-ingestion.js";
import * as s3Helper from "./utils/s3-helper.js";
import { writeClient } from "./aws-clients.js";
import { WriteRecordsCommand } from "@aws-sdk/client-timestream-write";

const csvFilePath = "sample.csv";

async function writeRecordsFromCSV() {
  if (csvFilePath != null) {
    await csvIngestion.processCSV(csvFilePath);
  }
}

async function setupTimestream() {
  await timestreamSetupHelper.createDatabase(DATABASE_NAME);
  await s3Helper.createS3Bucket(SQ_ERROR_CONFIGURATION_S3_BUCKET_NAME);
  await timestreamSetupHelper.createTable(DATABASE_NAME, TABLE_NAME);
  // await timestreamSetupHelper.describeDatabase();
  // await timestreamSetupHelper.listDatabases();
  // await timestreamSetupHelper.describeTable();
  // await timestreamSetupHelper.listTables();
  // await timestreamSetupHelper.updateTable();
}

async function writeRecord(data, measureName, measureValue, measureValueType) {
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
    {
      
    }
  ];

  const params = {
    DatabaseName: DATABASE_NAME,
    TableName: TABLE_NAME,
    Records: records,
  };
  try {
    const writeRecordsCommand = new WriteRecordsCommand(params);
    const response = await writeClient.send(writeRecordsCommand);

    console.log("WriteRecords Status: ", response.$metadata.httpStatusCode);

    return response;
  } catch (err) {
    console.log("Error writing records. ", err);
    throw err;
  }
}

export { writeRecordsFromCSV, setupTimestream, writeRecord };
