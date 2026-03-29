import { google } from 'googleapis';

// Service account authentication using GOOGLE_CREDENTIALS secret
export async function getGoogleSheetClient() {
  try {
    const credentialsJson = process.env.GOOGLE_CREDENTIALS;
    
    if (!credentialsJson) {
      throw new Error('GOOGLE_CREDENTIALS environment variable not set');
    }

    const credentials = JSON.parse(credentialsJson);

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    return sheets;
  } catch (error) {
    console.error('Error initializing Google Sheets client:', error);
    throw error;
  }
}

export async function appendToSheet(spreadsheetId: string, range: string, values: any[][]) {
  try {
    const sheets = await getGoogleSheetClient();
    
    console.log(`Attempting to append ${values.length} rows to sheet ${spreadsheetId}, range: ${range}`);
    
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values,
      },
    });

    console.log(`Successfully appended to Google Sheets. Updated ${response.data.updates?.updatedRows || 0} rows`);
    return response.data;
  } catch (error: any) {
    console.error('Error appending to Google Sheet:', {
      message: error.message,
      code: error.code,
      errors: error.errors,
      spreadsheetId,
      range,
    });
    throw error;
  }
}

async function ensureSheetTabExists(sheets: any, spreadsheetId: string, sheetName: string) {
  try {
    const meta = await sheets.spreadsheets.get({ spreadsheetId });
    const existingSheets = meta.data.sheets?.map((s: any) => s.properties?.title) || [];
    if (!existingSheets.includes(sheetName)) {
      console.log(`Creating missing tab "${sheetName}" in spreadsheet ${spreadsheetId.substring(0, 8)}...`);
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
          requests: [{ addSheet: { properties: { title: sheetName } } }],
        },
      });
      console.log(`✓ Tab "${sheetName}" created`);
    }
  } catch (error: any) {
    console.error(`Error checking/creating tab "${sheetName}":`, error.message);
    throw error;
  }
}

export async function ensureHeaders(spreadsheetId: string, sheetName: string, headers: string[]) {
  try {
    const sheets = await getGoogleSheetClient();

    // Ensure the tab exists before reading/writing
    await ensureSheetTabExists(sheets, spreadsheetId, sheetName);
    
    // Check if first row exists and read current headers
    const range = `${sheetName}!A1:Z1`;
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const existingHeaders = response.data.values?.[0] || [];
    
    // Compare existing headers with canonical headers
    const headersMatch = 
      existingHeaders.length === headers.length &&
      existingHeaders.every((header: string, index: number) => header === headers[index]);
    
    // If headers don't match (wrong, missing, or different order), set the correct headers
    if (!headersMatch) {
      console.log(`Synchronizing headers for ${sheetName} in spreadsheet ${spreadsheetId.substring(0, 8)}...`);
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `${sheetName}!A1:${String.fromCharCode(65 + headers.length - 1)}1`,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [headers],
        },
      });
      console.log(`✓ Headers synchronized for ${sheetName} (${headers.length} columns)`);
    } else {
      console.log(`✓ Headers already correct for ${sheetName}`);
    }
  } catch (error: any) {
    console.error(`Error ensuring headers for ${sheetName}:`, {
      message: error.message,
      code: error.code,
      spreadsheetId: spreadsheetId.substring(0, 8) + '...',
    });
    throw error;
  }
}

export async function createSpreadsheet(title: string, headers: string[]) {
  try {
    const sheets = await getGoogleSheetClient();
    
    const response = await sheets.spreadsheets.create({
      requestBody: {
        properties: {
          title,
        },
        sheets: [
          {
            properties: {
              title: 'Submissions',
            },
          },
        ],
      },
    });

    const spreadsheetId = response.data.spreadsheetId;
    
    if (spreadsheetId && headers.length > 0) {
      await appendToSheet(spreadsheetId, 'Submissions!A1', [headers]);
    }

    console.log(`Created new spreadsheet: ${spreadsheetId}`);
    return response.data;
  } catch (error) {
    console.error('Error creating Google Sheet:', error);
    throw error;
  }
}
