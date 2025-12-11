import { google } from 'googleapis';

// In-memory cache for Vercel serverless
let cache = null;
let lastFetch = 0;
const CACHE_DURATION = 30000; // 30 seconds

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const now = Date.now();
    
    // Return cached data if still valid
    if (cache && (now - lastFetch) < CACHE_DURATION) {
      return res.status(200).json({ ...cache, fromCache: true });
    }

    // Fetch fresh data from Google Sheets
    const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);
    
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });
    
    const sheets = google.sheets({ version: 'v4', auth });
    
    const spreadsheetId = process.env.SPREADSHEET_ID;
    const sheetName = process.env.SHEET_NAME || 'Real data Leetcode';
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `'${sheetName}'!A:ZZ`,
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      throw new Error('No data found in sheet');
    }

    const headers = rows[0];
    const data = rows.slice(1)
      .filter(row => row && row.length > 0 && row[0])
      .map((row, index) => {
        const record = {
          id: index + 1,
          registerNumber: row[0] || '',
          name: row[1] || '',
          leetcodeId: row[2] || '',
          problemsSolved: parseInt(row[3]) || 0,
          rating: parseInt(row[4]) || 0,
          contests: {}
        };

        for (let i = 5; i < headers.length; i++) {
          if (headers[i] && headers[i].trim()) {
            const contestName = headers[i].trim();
            const cellValue = row[i] ? row[i].toString().trim() : '';
            
            if (cellValue === '' || cellValue.toLowerCase() === 'n/a') {
              record.contests[contestName] = 0;
            } else {
              const numValue = parseFloat(cellValue);
              record.contests[contestName] = isNaN(numValue) ? 0 : numValue;
            }
          }
        }

        return record;
      });

    const contestNames = headers.slice(5).filter(h => h && h.trim());

    const result = {
      headers,
      data,
      contestNames,
      lastUpdated: new Date().toISOString(),
      totalStudents: data.length
    };

    // Update cache
    cache = result;
    lastFetch = now;

    res.status(200).json({ ...result, fromCache: false });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch data',
      message: error.message 
    });
  }
}
