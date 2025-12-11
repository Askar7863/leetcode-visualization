# Google Sheets API Setup Guide

This guide will walk you through setting up Google Sheets API access for the LeetCode Contest Dashboard.

## 🎯 Prerequisites

- A Google account
- Access to your Google Sheet
- 10 minutes of your time

---

## 📝 Step-by-Step Setup

### Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click the project dropdown at the top
3. Click **"New Project"**
4. Enter project name: `LeetCode Dashboard`
5. Click **"Create"**
6. Wait for project creation (30 seconds)

### Step 2: Enable Google Sheets API

1. In the search bar, type `Google Sheets API`
2. Click on **"Google Sheets API"**
3. Click the **"Enable"** button
4. Wait for API to be enabled

### Step 3: Create API Credentials

1. Click **"Create Credentials"** button
2. Select **"API Key"**
3. Your API key will be generated
4. **IMPORTANT**: Copy this key immediately!
5. Click **"Close"**

### Step 4: Restrict API Key (Security)

1. Find your newly created API key in the list
2. Click the **edit/pencil icon**
3. Under **"API restrictions"**:
   - Select **"Restrict key"**
   - Check **"Google Sheets API"**
4. Under **"Application restrictions"** (optional):
   - Select **"HTTP referrers"**
   - Add your website URL (e.g., `https://yourdomain.com/*`)
5. Click **"Save"**

### Step 5: Make Your Google Sheet Public

1. Open your Google Sheet
2. Click the **"Share"** button (top right)
3. Change access to:
   - **"Anyone with the link"**
   - **"Viewer"** access
4. Click **"Done"**

### Step 6: Get Your Spreadsheet ID

Your spreadsheet ID is in the URL:

```
https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit
                                        ^^^^^^^^^^^^^^
                                        Copy this part
```

Example:
```
URL: https://docs.google.com/spreadsheets/d/1pFtWLyvIHuLhxY6QAijJNalRnvE5pxgvmbVDzsAtA4w/edit

ID: 1pFtWLyvIHuLhxY6QAijJNalRnvE5pxgvmbVDzsAtA4w
```

### Step 7: Configure Backend

1. Navigate to the `backend` folder
2. Create `.env` file (copy from `.env.example`):

```powershell
Copy-Item .env.example .env
```

3. Edit `.env` with your details:

```env
GOOGLE_SHEETS_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXX
SPREADSHEET_ID=1pFtWLyvIHuLhxY6QAijJNalRnvE5pxgvmbVDzsAtA4w
SHEET_NAME=WhatsApp Contest Tracker
PORT=3001
CACHE_TTL=30
```

4. Save the file

### Step 8: Test Your Setup

```powershell
# Start backend
cd backend
npm install
npm start

# Test API in browser:
# Open: http://localhost:3001/api/health
# Should see: {"status":"healthy",...}

# Test data fetch:
# Open: http://localhost:3001/api/data
# Should see your sheet data
```

---

## 🔒 Security Best Practices

### ✅ **DO:**
- Store API keys in `.env` files
- Add `.env` to `.gitignore`
- Restrict API key to Google Sheets API only
- Use backend proxy (never expose keys in frontend)
- Make sheet "View Only" public
- Regularly rotate API keys

### ❌ **DON'T:**
- Commit API keys to Git
- Share API keys publicly
- Give sheet "Edit" access publicly
- Use unrestricted API keys
- Hardcode API keys in source code

---

## 🐛 Troubleshooting

### Error: "API key not valid"

**Causes:**
- API key not copied correctly
- Google Sheets API not enabled
- API key restrictions too strict

**Solutions:**
1. Double-check API key in `.env`
2. Ensure no extra spaces
3. Verify Google Sheets API is enabled
4. Temporarily remove API restrictions for testing

### Error: "The caller does not have permission"

**Causes:**
- Sheet is not public
- Wrong spreadsheet ID
- API not enabled

**Solutions:**
1. Make sheet public (Anyone with link → Viewer)
2. Verify SPREADSHEET_ID is correct
3. Re-enable Google Sheets API

### Error: "Unable to parse range"

**Causes:**
- Sheet name is incorrect
- Sheet doesn't exist
- Special characters in sheet name

**Solutions:**
1. Check SHEET_NAME matches exactly (case-sensitive)
2. If sheet name has spaces, keep them in .env
3. If sheet name has special chars, wrap in quotes

### Error: "Quota exceeded"

**Causes:**
- Too many API requests
- Free tier limit reached

**Solutions:**
1. Increase CACHE_TTL in .env
2. Reduce refreshInterval in frontend
3. Enable billing in Google Cloud (if needed)

---

## 📊 API Usage Limits

Google Sheets API free tier limits:
- **Reads**: 100 requests per 100 seconds per user
- **Writes**: 100 requests per 100 seconds per user

Our app is read-only and caches responses, so you'll stay well within limits.

---

## 💡 Alternative: Service Account (Advanced)

For production environments, consider using a Service Account:

### Benefits:
- No need to make sheet public
- Better security
- Higher quota limits

### Setup:

1. In Google Cloud Console:
   - Go to "IAM & Admin" > "Service Accounts"
   - Click "Create Service Account"
   - Give it a name and create

2. Create Key:
   - Click on the service account
   - Go to "Keys" tab
   - "Add Key" > "Create New Key" > "JSON"
   - Download the JSON file

3. Share Sheet with Service Account:
   - Open your Google Sheet
   - Click "Share"
   - Add service account email (found in JSON)
   - Give "Viewer" access

4. Update Backend:

```javascript
// In server.js, replace API key with:
const auth = new google.auth.GoogleAuth({
  keyFile: './service-account-key.json',
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});

const sheets = google.sheets({ version: 'v4', auth });
```

---

## 🎓 Understanding Google Sheets API

### What is it?
Google Sheets API allows programmatic access to Google Sheets data.

### How does it work?
1. You make HTTP requests to Google's servers
2. Include your API key for authentication
3. Google returns sheet data in JSON format
4. Your app processes and displays the data

### API Endpoints Used:
```
GET https://sheets.googleapis.com/v4/spreadsheets/{spreadsheetId}/values/{range}?key={apiKey}
```

---

## 📈 Monitoring Usage

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to "APIs & Services" > "Dashboard"
3. Click on "Google Sheets API"
4. View request metrics and quotas

---

## 🔄 Rotating API Keys

**Best Practice**: Rotate keys every 90 days

1. Create new API key (Step 3 above)
2. Update `.env` with new key
3. Restart backend
4. Delete old API key from Google Cloud Console

---

## ✅ Verification Checklist

Before deploying, verify:

- [ ] Google Sheets API is enabled
- [ ] API key is created and copied
- [ ] API key has restrictions (Sheets API only)
- [ ] Google Sheet is public (View access)
- [ ] SPREADSHEET_ID is correct
- [ ] SHEET_NAME is correct (case-sensitive)
- [ ] `.env` file exists and has correct values
- [ ] `.env` is in `.gitignore`
- [ ] Backend starts without errors
- [ ] `/api/data` returns sheet data
- [ ] Frontend connects to backend

---

## 📞 Need Help?

Common issues:
1. **"Cannot read property 'values'"**: Sheet name incorrect
2. **"Request had insufficient authentication"**: API key wrong
3. **"The caller does not have permission"**: Sheet not public

Still stuck? Check:
- [Google Sheets API Documentation](https://developers.google.com/sheets/api)
- [Stack Overflow - Google Sheets API](https://stackoverflow.com/questions/tagged/google-sheets-api)

---

## 🎉 Success!

If you can access `http://localhost:3001/api/data` and see your sheet data, you're all set!

Your Google Sheets API is now configured and ready for the dashboard.

---

**Next Step**: Return to main README.md and continue with frontend setup.
