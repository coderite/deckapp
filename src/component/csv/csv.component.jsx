import { v4 as uuidv4 } from 'uuid';
import Papa from 'papaparse';

// Function 'verifyHeaders' takes two parameters: 'expectedHeaders' and 'parsedHeaders'.
// what it does; it checks if the headers in the CSV file match the expected headers and throws an error if they don't.
function verifyHeaders(expectedHeaders, parsedHeaders) {
  console.log(`header fields in uploaded file: ${parsedHeaders}`);
  // loop through each field in the header row and check if it matches the expected header
  const areHeadersCorrect = parsedHeaders.every(header =>
    expectedHeaders.includes(header)
  );
  // if the headers are incorrect, reject the promise with an error message
  if (!areHeadersCorrect) {
    throw new Error(
      'Header row error! Check that the header row in the CSV file contains these lowercase entries: slot, tester, video, screenshot1, screenshot2, screenshot3, merchant, location '
    );
  }
}

// Function 'parseCsvFile' takes a 'file' as a parameter and returns a promise.
function parseCsvFile(file) {
  return new Promise((resolve, reject) => {
    // Define 'handleFileRead', a function that processes the result of the CSV parsing.
    const handleFileRead = result => {
      // Initialize an empty array 'rows' to store row objects.
      const rows = [];
      // 'data' contains the parsed data from the CSV file.
      const data = result.data;

      // check if the headers are correct. Note that the slot header is used for sorting.
      const expectedHeaders = [
        'slot',
        'tester',
        'video',
        'screenshot1',
        'screenshot2',
        'screenshot3',
        'merchant',
        'location',
      ];

      const parsedHeaders = result.meta.fields;

      try {
        verifyHeaders(expectedHeaders, parsedHeaders);
      } catch (error) {
        reject(error);
      }

      // Loop through each row of data.
      for (const rowData of data) {
        // Create an object 'rowObject' mapping each field to its corresponding value in the CSV row.
        // Note that 'id' is generated using the 'uuidv4' function.
        if (
          rowData.screenshot1 === undefined &&
          rowData.screenshot2 === undefined &&
          rowData.screenshot3 === undefined
        ) {
          continue;
        }
        const rowObject = {
          id: uuidv4(),
          slot: rowData.slot,
          tester: rowData.tester,
          video: rowData.video,
          payment: rowData.screenshot1,
          widget: rowData.screenshot2,
          security: rowData.screenshot3,
          merchant: rowData.merchant,
          location: rowData.location,
        };
        // Add the created object to the 'rows' array.
        rows.push(rowObject);
      }

      // Resolve the promise with the rows array after removing empty entries.
      resolve(removeEmptyEntries(rows));
    };

    // Define 'handleError', a function that handles errors during CSV parsing.
    // It simply rejects the promise with the error.
    const handleError = error => {
      reject(error);
    };

    // Use 'Papa.parse' to parse the CSV file.
    // It takes the 'file' to be parsed and an options object.
    // 'header: true' indicates that the first row of the CSV contains column headers.
    // 'complete' and 'error' are callback functions executed on successful parsing or on error, respectively.
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
