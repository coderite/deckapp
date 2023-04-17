import { v4 as uuidv4 } from 'uuid';
import Papa from 'papaparse';

function parseCsvFile(file) {
  return new Promise((resolve, reject) => {
    const handleFileRead = result => {
      const rows = [];
      const data = result.data;

      for (const rowData of data) {
        const rowObject = {
          id: uuidv4(),
          slot: rowData.slot,
          tester: rowData.tester,
          video: rowData.video,
          payment: rowData['Payment lineup'],
          widget: rowData.widget,
          security: rowData['Security slider'],
          merchant: rowData.merchant,
          location: rowData.location,
        };
        rows.push(rowObject);
      }

      resolve(removeEmptyEntries(rows));
    };

    const handleError = error => {
      reject(error);
    };

    Papa.parse(file, {
      header: true,
      complete: handleFileRead,
      error: handleError,
    });
  });
}

function removeEmptyEntries(obj) {
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];

      // Check if the value is an empty string, null, or undefined
      if (value === '' || value === null || value === undefined) {
        delete obj[key];
      }
    }
  }
  return obj;
}

export { parseCsvFile };
