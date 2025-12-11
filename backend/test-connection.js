import { google } from 'googleapis';
import { readFileSync } from 'fs';
import dotenv from 'dotenv';

dotenv.config();

async function testConnection() {
  try {
    console.log('🔍 Testing Google Sheets connection...\n');
    
    // Load credentials
    const credentials = JSON.parse(readFileSync('../credentials.json', 'utf8'));
    console.log('✅ Credentials loaded');
    console.log(`📧 Service Account: ${credentials.client_email}\n`);
    
    // Create auth
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });
    
    const sheets = google.sheets({ version: 'v4', auth });
    console.log('✅ Google Sheets API initialized\n');
    
    const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
    const SHEET_NAME = process.env.SHEET_NAME;
    
    console.log(`📊 Spreadsheet ID: ${SPREADSHEET_ID}`);
    console.log(`📄 Sheet Name: ${SHEET_NAME}\n`);
    
    // Test 1: Get spreadsheet metadata
    console.log('📋 Test 1: Getting spreadsheet metadata...');
    const metadata = await sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID,
    });
    
    console.log(`✅ Spreadsheet Title: ${metadata.data.properties.title}`);
    console.log(`✅ Available sheets:`);
    metadata.data.sheets.forEach(sheet => {
      console.log(`   - ${sheet.properties.title}`);
    });
    console.log('');
    
    // Test 2: Get data from the sheet
    console.log('📋 Test 2: Fetching data from sheet...');
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `'${SHEET_NAME}'!A1:Z3`, // Get first 3 rows to see structure
    });
    
    const rows = response.data.values;
    console.log(`✅ Successfully fetched ${rows.length} rows`);
    console.log(`\n🔍 Headers (Row 0):`, rows[0]);
    console.log(`\n🔍 Column count:`, rows[0].length);
    if (rows.length > 1) {
      console.log(`\n🔍 Sample data (Row 1):`, rows[1]);
    }
    console.log(`\n✅ Data rows: ${rows.length - 1}\n`);
    
    console.log('🎉 All tests passed! Connection is working!\n');
    console.log('💡 Now you can start the server with: npm start');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    
    if (error.message.includes('permission') || error.message.includes('not found')) {
      console.error('\n🔒 Permission Error!');
      console.error('\n📝 To fix this, share your Google Sheet with:');
      console.error('   automation-askar@automation-479505.iam.gserviceaccount.com');
      console.error('\nSteps:');
      console.error('   1. Open your Google Sheet');
      console.error('   2. Click "Share" button');
      console.error('   3. Add the email above');
      console.error('   4. Set permission to "Viewer"');
      console.error('   5. Click "Send"');
    } else if (error.message.includes('Unable to parse range')) {
      console.error('\n📋 Sheet Name Error!');
      console.error(`\n💡 The sheet name "${process.env.SHEET_NAME}" was not found.`);
      console.error('\nCheck the available sheets listed above and update your .env file.');
    }
  }
}

testConnection();
