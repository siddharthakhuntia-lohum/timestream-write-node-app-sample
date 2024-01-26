import { deleteDatabase, deleteTable } from "./utils/timestreamSetup.js";
import {
  createDatabase,
  writeRecord,
  writeRecordsFromCSV,
} from "./writeFunctions.js";

(async () => {
  try {
    await createDatabase();
    await writeRecordsFromCSV();
  } catch (err) {
    console.log("Error: ", err);
  } finally {
    // await deleteTable(DATABASE_NAME, TABLE_NAME);
    // await deleteDatabase(DATABASE_NAME);
  }
})();
