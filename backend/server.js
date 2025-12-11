import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { google } from 'googleapis';
import NodeCache from 'node-cache';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const cache = new NodeCache({ stdTTL: parseInt(process.env.CACHE_TTL) || 30 });

// Configure CORS
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:5173', 'http://localhost:3000'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true); // Allow all origins in development
    }
  }
}));

app.use(express.json());

// Initialize Google Sheets API with Service Account
let sheets;
let auth;

try {
  const credentialsPath = join(__dirname, '..', 'credentials.json');
  const credentials = JSON.parse(readFileSync(credentialsPath, 'utf8'));
  
  auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });
  
  sheets = google.sheets({
    version: 'v4',
    auth,
  });
  
  console.log('✅ Google Sheets authentication configured (Service Account)');
} catch (error) {
  console.error('❌ Failed to load credentials.json:', error.message);
  console.log('💡 Place credentials.json in the project root directory');
  process.exit(1);
}

const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
const SHEET_NAME = process.env.SHEET_NAME || 'Real data Leetcode';

// Helper function to get available sheet names
async function getAvailableSheets() {
  try {
    const response = await sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID,
    });
    return response.data.sheets.map(sheet => sheet.properties.title);
  } catch (error) {
    console.error('Error getting sheet names:', error.message);
    return [];
  }
}

// Fetch data from Google Sheets
async function fetchSheetData() {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `'${SHEET_NAME}'!A:ZZ`, // Get all columns (quote sheet name to handle spaces)
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      throw new Error('No data found in sheet');
    }

    // Parse headers and data
    const headers = rows[0];
    const data = rows.slice(1)
      .filter(row => row && row.length > 0 && row[0]) // Filter out empty rows
      .map((row, index) => {
        const record = {
          id: index + 1,
          registerNumber: row[0] || '',
          name: row[1] || '',
          leetcodeId: row[2] || '',
          problemsSolved: parseInt(row[3]) || 0,
          rating: parseInt(row[4]) || 0, // Contest Rating from column 4
          contests: {}
        };

        // Parse contest columns (from column 5 onwards - individual contest scores/problems)
        // Values can be: numbers (0, 1, 2, 3, 4) or "N/A"
        for (let i = 5; i < headers.length; i++) {
          if (headers[i] && headers[i].trim()) {
            const contestName = headers[i].trim();
            const cellValue = row[i] ? row[i].toString().trim() : '';
            
            // Handle N/A, empty, or null values
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

    // Extract contest names (from column 5 onwards)
    const contestNames = headers.slice(5).filter(h => h && h.trim());

    return {
      headers,
      data,
      contestNames,
      lastUpdated: new Date().toISOString(),
      totalStudents: data.length
    };
  } catch (error) {
    console.error('Error fetching sheet data:', error.message);
    if (error.message.includes('Unable to parse range')) {
      console.error('💡 Check if SHEET_NAME in .env matches the actual sheet tab name');
      const availableSheets = await getAvailableSheets();
      if (availableSheets.length > 0) {
        console.error('📋 Available sheets in this spreadsheet:', availableSheets.join(', '));
      }
    }
    if (error.message.includes('permission') || error.message.includes('not found')) {
      console.error('💡 Make sure to share the Google Sheet with:');
      console.error('   automation-askar@automation-479505.iam.gserviceaccount.com');
    }
    throw error;
  }
}

// API endpoint to get sheet data
app.get('/api/data', async (req, res) => {
  try {
    // Check cache first
    const cachedData = cache.get('sheetData');
    if (cachedData) {
      return res.json({ ...cachedData, fromCache: true });
    }

    // Fetch fresh data
    const data = await fetchSheetData();
    
    // Cache the data
    cache.set('sheetData', data);
    
    res.json({ ...data, fromCache: false });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch data',
      message: error.message 
    });
  }
});

// API endpoint to get statistics
app.get('/api/stats', async (req, res) => {
  try {
    const cachedData = cache.get('sheetData');
    let data;

    if (cachedData) {
      data = cachedData;
    } else {
      data = await fetchSheetData();
      cache.set('sheetData', data);
    }

    // Calculate statistics
    // Calculate average attendance: take attendance count of each contest, average them, then convert to percentage
    let totalAttendanceCount = 0;
    const totalStudents = data.data.length;
    const contestCount = data.contestNames.length;
    
    if (contestCount > 0 && totalStudents > 0) {
      data.contestNames.forEach(contest => {
        const attendedCount = data.data.filter(student => {
          const value = student.contests[contest];
          // A student attended if they have any value greater than 0
          return value && value > 0;
        }).length;
        totalAttendanceCount += attendedCount;
      });
    }
    
    const averageAttendanceCount = contestCount > 0 ? totalAttendanceCount / contestCount : 0;
    const averageAttendance = totalStudents > 0 ? Math.round((averageAttendanceCount / totalStudents) * 100) : 0;
    
    const stats = {
      totalStudents: data.data.length,
      averageRating: Math.round(
        data.data.reduce((sum, student) => sum + student.rating, 0) / data.data.length
      ),
      totalProblems: data.data.reduce((sum, student) => sum + student.problemsSolved, 0),
      averageProblems: Math.round(
        data.data.reduce((sum, student) => sum + student.problemsSolved, 0) / data.data.length
      ),
      averageAttendance: averageAttendance,
      topRating: Math.max(...data.data.map(s => s.rating)),
      topSolver: Math.max(...data.data.map(s => s.problemsSolved)),
      contestCount: data.contestNames.length,
      lastUpdated: data.lastUpdated
    };

    res.json(stats);
  } catch (error) {
    console.error('Stats Error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch statistics',
      message: error.message 
    });
  }
});

// API endpoint to manually refresh cache
app.post('/api/refresh', async (req, res) => {
  try {
    cache.del('sheetData');
    const data = await fetchSheetData();
    cache.set('sheetData', data);
    res.json({ 
      success: true, 
      message: 'Cache refreshed successfully',
      lastUpdated: data.lastUpdated
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to refresh cache',
      message: error.message 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    cacheSize: cache.keys().length
  });
});

// Debug endpoint to list available sheets
app.get('/api/sheets', async (req, res) => {
  try {
    const availableSheets = await getAvailableSheets();
    res.json({ 
      spreadsheetId: SPREADSHEET_ID,
      configuredSheet: SHEET_NAME,
      availableSheets: availableSheets
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to get sheets',
      message: error.message 
    });
  }
});

// Auto-refresh cache every 30 seconds
setInterval(async () => {
  try {
    console.log('Auto-refreshing cache...');
    const data = await fetchSheetData();
    cache.set('sheetData', data);
    console.log(`Cache refreshed at ${data.lastUpdated}`);
  } catch (error) {
    console.error('Auto-refresh error:', error.message);
  }
}, 30000); // 30 seconds

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📊 Spreadsheet ID: ${SPREADSHEET_ID}`);
  console.log(`📄 Sheet Name: ${SHEET_NAME}`);
  console.log(`🔄 Auto-refresh enabled (every 30 seconds)`);
});
