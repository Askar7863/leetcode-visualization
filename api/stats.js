import { google } from 'googleapis';

// In-memory cache
let cache = null;
let lastFetch = 0;
const CACHE_DURATION = 30000; // 30 seconds

async function fetchSheetData() {
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

  return { headers, data, contestNames, lastUpdated: new Date().toISOString(), totalStudents: data.length };
}

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
    let data;

    if (cache && (now - lastFetch) < CACHE_DURATION) {
      data = cache;
    } else {
      data = await fetchSheetData();
      cache = data;
      lastFetch = now;
    }

    // Calculate average attendance
    let totalAttendanceCount = 0;
    const totalStudents = data.data.length;
    const contestCount = data.contestNames.length;
    
    if (contestCount > 0 && totalStudents > 0) {
      data.contestNames.forEach(contest => {
        const attendedCount = data.data.filter(student => {
          const value = student.contests[contest];
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

    res.status(200).json(stats);
  } catch (error) {
    console.error('Stats Error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch statistics',
      message: error.message 
    });
  }
}
