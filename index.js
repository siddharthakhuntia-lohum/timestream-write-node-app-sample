import { deleteDatabase, deleteTable } from "./utils/timestreamSetup.js";
import {
  setupTimestream,
  writeRecord,
  writeRecordsFromCSV,
} from "./writeFunctions.js";

import { DATABASE_NAME, TABLE_NAME } from "./constants.js";

(async () => {
  let data = {
    batteryNumber: 123,
    batteryType: "Li-ion",
    batteryModel: "Model X",
    deviceIMEI: "123456789012345",
    deviceIP: "192.168.1.1",
    recordTime: new Date().getTime(),
  };

  let measureName = "BatteryLife";
  let measureValue = "80";
  let measureValueType = "DOUBLE";
  try {
    await setupTimestream();
    await writeRecord(data, measureName, measureValue, measureValueType);
  } catch (err) {
    console.log("Error: ", err);
  } finally {
    // await deleteTable(DATABASE_NAME, TABLE_NAME);
    // await deleteDatabase(DATABASE_NAME);
  }
})();
