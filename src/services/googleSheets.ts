import { google } from 'googleapis';

export interface PickupStatus {
  serialNumber: string;
  model: string;
  outputK: string;
  status: string;
  lastUpdate: string;
}

const PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
const CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL;
const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID;

// Memoize the auth client outside the request handler function for high performance/zero-cost
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: CLIENT_EMAIL,
    private_key: PRIVATE_KEY,
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});

const sheets = google.sheets({ version: 'v4', auth });

/**
 * Fetches the raw array from Google Sheets and filters by the provided serial number.
 * Normalizes the array into the PickupStatus interface.
 */
export async function getPickupStatusBySerialNumber(sn: string): Promise<PickupStatus | null> {
  if (!SPREADSHEET_ID) {
    throw new Error('Server configured without GOOGLE_SPREADSHEET_ID');
  }

  // Assuming columns are: A: Serial Number, B: Model, C: Output (kΩ), D: Status, E: Last Update
  // Adjust the range 'Sheet1!A:E' if your sheet has a different name
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Sheet1!A:E',
  });

  const rows = response.data.values;
  if (!rows || rows.length === 0) {
    return null;
  }

  const searchSn = sn.trim().toLowerCase();

  // Find the row where the serial number matches.
  // Assuming row 0 is headers, so we can start parsing from row 1, 
  // but it's safer to just search all rows where column A exists.
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const serialNumber = row[0]?.toString().trim() || '';
    
    // Ignore header row or empty serial numbers
    if (serialNumber.toLowerCase() === searchSn) {
      return {
        serialNumber,
        model: row[1]?.toString().trim() || '',
        outputK: row[2]?.toString().trim() || '',
        status: row[3]?.toString().trim() || '',
        lastUpdate: row[4]?.toString().trim() || '',
      };
    }
  }

  return null;
}
