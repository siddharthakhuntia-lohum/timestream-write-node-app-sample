import {
  CreateDatabaseCommand,
  CreateTableCommand,
  DeleteTableCommand,
  DeleteDatabaseCommand,
} from "@aws-sdk/client-timestream-write";

import { getS3ErrorReportBucketName } from "./s3-helper.js";
import { writeClient } from "../aws-clients.js";

import { HT_TTL_HOURS, CT_TTL_DAYS } from "../constants.js";

async function createDatabase(databaseName) {
  console.log("Creating Database");
  const params = {
    DatabaseName: databaseName,
  };

  const databaseCreateCMD = new CreateDatabaseCommand(params);

  try {
    const response = await writeClient.send(databaseCreateCMD);

    console.log("DATABASE CREATED");
  } catch (err) {
    if (err.name === "ConflictException") {
      console.log(
        `Database ${params.DatabaseName} already exists. Skipping creation.`
      );
    } else {
      console.log("Error creating database", err.code);
    }
  }
}

async function createTable(databaseName, tableName) {
  console.log("Creating Table");
  const bucketName = await getS3ErrorReportBucketName();
  const params = {
    DatabaseName: databaseName,
    TableName: tableName,
    RetentionProperties: {
      MemoryStoreRetentionPeriodInHours: HT_TTL_HOURS,
      MagneticStoreRetentionPeriodInDays: CT_TTL_DAYS,
    },
    MagneticStoreWriteProperties: {
      EnableMagneticStoreWrites: true,
      MagneticStoreRejectedDataLocation: {
        S3Configuration: {
          BucketName: bucketName,
          EncryptionOption: "SSE_S3",
        },
      },
    },
  };
  const tableCreateCMD = new CreateTableCommand(params);

  try {
    const response = await writeClient.send(tableCreateCMD);
  } catch (err) {
    if (err.name === "ConflictException") {
      console.log(
        `Table ${params.TableName} already exists on db ${params.DatabaseName}. Skipping creation.`
      );
    } else {
      console.log("Error creating table. ", err);
      throw err;
    }
  }
}

async function deleteDatabase(databaseName) {
  console.log("Deleting Database " + databaseName);
  const params = {
    DatabaseName: databaseName,
  };

  try {
    const databaseDeleteCMD = new DeleteDatabaseCommand(params);
    const response = await writeClient.send(databaseDeleteCMD);

    console.log("DATABASE DELETED");
  } catch (err) {
    if (err.name === "ResourceNotFoundException") {
      console.log(`Database ${params.DatabaseName} doesn't exists.`);
    } else {
      console.log("Error deleting database. ", err);
      throw err;
    }
  }
}

async function deleteTable(databaseName, tableName) {
  console.log("Deleting Table " + tableName);
  const params = {
    DatabaseName: databaseName,
    TableName: tableName,
  };

  try {
    const tableDeleteCMD = new DeleteTableCommand(params);
    const response = await writeClient.send(tableDeleteCMD);

    console.log("TABLE DELETED");
  } catch (err) {
    if (err.name === "ResourceNotFoundException") {
      console.log(
        `Table ${params.TableName} doesn't exists on db ${params.DatabaseName}.`
      );
    } else {
      console.log("Error deleting table. ", err);
      throw err;
    }
  }
}

// async function describeDatabase() {
//   console.log("Describing Database");
//   const params = {
//     DatabaseName: DATABASE_NAME,
//   };

//   const promise = writeClient.describeDatabase(params).promise();

//   await promise.then(
//     (data) => {
//       console.log(
//         `Database ${data.Database.DatabaseName} has id ${data.Database.Arn}`
//       );
//     },
//     (err) => {
//       if (err.code === "ResourceNotFoundException") {
//         console.log("Database doesn't exists.");
//       } else {
//         console.log("Describe database failed.", err);
//         throw err;
//       }
//     }
//   );
// }

// async function updateDatabase(updatedKmsKeyId) {
//   if (updatedKmsKeyId === undefined) {
//     console.log("Skipping UpdateDatabase; KmsKeyId was not given");
//     return;
//   }
//   console.log("Updating Database");
//   const params = {
//     DatabaseName: DATABASE_NAME,
//     KmsKeyId: updatedKmsKeyId,
//   };

//   const promise = writeClient.updateDatabase(params).promise();

//   await promise.then(
//     (data) => {
//       console.log(
//         `Database ${data.Database.DatabaseName} updated kmsKeyId to ${updatedKmsKeyId}`
//       );
//     },
//     (err) => {
//       if (err.code === "ResourceNotFoundException") {
//         console.log("Database doesn't exist.");
//       } else {
//         console.log("Update database failed.", err);
//       }
//     }
//   );
// }

// async function listDatabases() {
//   console.log("Listing databases:");
//   const databases = await getDatabasesList(null);
//   databases.forEach(function (database) {
//     console.log(database.DatabaseName);
//   });
// }

// async function getDatabasesList(nextToken, databases = []) {
//   var params = {
//     MaxResults: 15,
//   };

//   if (nextToken) {
//     params.NextToken = nextToken;
//   }

//   return writeClient
//     .listDatabases(params)
//     .promise()
//     .then(
//       (data) => {
//         databases.push(...data.Databases);
//         if (data.NextToken) {
//           return getDatabasesList(data.NextToken, databases);
//         } else {
//           return databases;
//         }
//       },
//       (err) => {
//         console.log("Error while listing databases", err);
//       }
//     );
// }

// async function updateTable() {
//   console.log("Updating Table");
//   const params = {
//     DatabaseName: DATABASE_NAME,
//     TableName: TABLE_NAME,
//     RetentionProperties: {
//       MemoryStoreRetentionPeriodInHours: HT_TTL_HOURS,
//       MagneticStoreRetentionPeriodInDays: CT_TTL_DAYS,
//     },
//   };

//   const promise = writeClient.updateTable(params).promise();

//   await promise.then(
//     () => {
//       console.log("Table updated");
//     },
//     (err) => {
//       console.log("Error updating table. ", err);
//       throw err;
//     }
//   );
// }

// async function describeTable() {
//   console.log("Describing Table");
//   const params = {
//     DatabaseName: DATABASE_NAME,
//     TableName: TABLE_NAME,
//   };

//   const promise = writeClient.describeTable(params).promise();

//   await promise.then(
//     (data) => {
//       console.log(`Table ${data.Table.TableName} has id ${data.Table.Arn}`);
//     },
//     (err) => {
//       if (err.code === "ResourceNotFoundException") {
//         console.log("Table or Database doesn't exists.");
//       } else {
//         console.log("Describe table failed.", err);
//         throw err;
//       }
//     }
//   );
// }

// async function listTables() {
//   console.log("Listing tables:");
//   const tables = await getTablesList(null);
//   tables.forEach(function (table) {
//     console.log(table.TableName);
//   });
// }

// function getTablesList(nextToken, tables = []) {
//   var params = {
//     DatabaseName: DATABASE_NAME,
//     MaxResults: 15,
//   };

//   if (nextToken) {
//     params.NextToken = nextToken;
//   }

//   return writeClient
//     .listTables(params)
//     .promise()
//     .then(
//       (data) => {
//         tables.push(...data.Tables);
//         if (data.NextToken) {
//           return getTablesList(data.NextToken, tables);
//         } else {
//           return tables;
//         }
//       },
//       (err) => {
//         console.log("Error while listing databases", err);
//       }
//     );
// }

export { createDatabase, createTable, deleteTable, deleteDatabase };
