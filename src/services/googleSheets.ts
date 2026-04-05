import { google } from "googleapis";

export interface PositionSpec {
  type: string;
  magnet: string;
  magnetWire: string;
  dcr: string;
}

export interface PickupSpec {
  serialNumber: string;
  neck?: PositionSpec;
  middle?: PositionSpec;
  bridge?: PositionSpec;
}

export interface PickupStatus {
  serialNumber: string;
  status: string;
  lastUpdate: string;
  spec: PickupSpec;
}

const PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
const CLIENT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID;

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: CLIENT_EMAIL,
    private_key: PRIVATE_KEY,
  },
  scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
});

const sheets = google.sheets({ version: "v4", auth });

export async function getPickupStatusBySerialNumber(
  sn: string,
): Promise<PickupStatus | null> {
  if (!SPREADSHEET_ID) {
    throw new Error("Server configured without GOOGLE_SPREADSHEET_ID");
  }

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: "main!A:R",
  });

  const rows = response.data.values;
  if (!rows || rows.length === 0) {
    return null;
  }

  const searchSn = sn.trim().toUpperCase();

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const serialNumber = row[1]?.toString().trim() || "";

    if (serialNumber.toUpperCase() === searchSn) {
      const createdAt = row[0]?.toString().trim() || "";
      const formatMagnet = (m1: any, m2: any) => {
        const v1 = m1?.toString().trim() || "";
        const v2 = m2?.toString().trim() || "";
        if (!v1 && !v2) return "-";
        if (v1 === v2 || !v2) return `alnico ${v1}`;
        if (!v1) return `alnico ${v2}`;
        return `alnico ${v1}/${v2}`;
      };

      const magnetNeckDisplayValue = formatMagnet(row[3], row[4]);
      const magnetMiddleDisplayValue = formatMagnet(row[8], row[9]);
      const magnetBridgeDisplayValue = formatMagnet(row[13], row[14]);
      const spec: PickupSpec = {
        serialNumber: row[1]?.toString().trim() || "",
        neck: row[2]
          ? {
              type: row[2]?.toString().trim() || "",
              magnet: magnetNeckDisplayValue,
              magnetWire: row[5]?.toString().trim() || "",
              dcr: row[6]?.toString().trim() || "",
            }
          : undefined,
        middle: row[7]
          ? {
              type: row[7]?.toString().trim() || "",
              magnet: magnetMiddleDisplayValue,
              magnetWire: row[10]?.toString().trim() || "",
              dcr: row[11]?.toString().trim() || "",
            }
          : undefined,
        bridge: row[12]
          ? {
              type: row[12]?.toString().trim() || "",
              magnet: magnetBridgeDisplayValue,
              magnetWire: row[15]?.toString().trim() || "",
              dcr: row[16]?.toString().trim() || "",
            }
          : undefined,
      };
      return {
        serialNumber,
        status: row[17]?.toString().trim() || "",
        lastUpdate: createdAt,
        spec,
      };
    }
  }

  return null;
}
