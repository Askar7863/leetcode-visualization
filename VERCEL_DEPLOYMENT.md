# Deploy to Vercel (All-in-One)

Deploy both frontend and backend to Vercel in one simple process!

## Why Vercel for Both?
✅ **Simpler** - One platform, one deployment
✅ **Free** - Generous free tier  
✅ **Fast** - Serverless functions auto-scale
✅ **Auto-updates** - Deploys automatically when Sheet changes (with 30s cache)

---

## Deployment Steps (5 minutes)

### Step 1: Prepare Google Credentials

1. Open your `credentials.json` file
2. Copy the **entire content** (you'll need this in Step 3)

### Step 2: Deploy to Vercel

1. Go to **https://vercel.com**
2. Sign in with GitHub
3. Click **"Add New..."** → **"Project"**
4. Select repository: `Askar7863/leetcode-visualization`
5. Click **"Import"**

### Step 3: Configure Project

**Root Directory:** Leave empty (use root)

**Build Settings:**
- Framework Preset: **Vite**
- Build Command: `cd frontend && npm install && npm run build`
- Output Directory: `frontend/dist`
- Install Command: `npm install`

### Step 4: Add Environment Variables

Click **"Environment Variables"** and add these 3 variables:

1. **Variable 1:**
   - Name: `GOOGLE_CREDENTIALS`
   - Value: (Paste your entire credentials.json content)

2. **Variable 2:**
   - Name: `SPREADSHEET_ID`
   - Value: `1pFtWLyvIHuLhxY6QAijJNalRnvE5pxgvmbVDzsAtA4w`

3. **Variable 3:**
   - Name: `SHEET_NAME`
   - Value: `Real data Leetcode`

### Step 5: Deploy!

1. Click **"Deploy"**
2. Wait 2-3 minutes
3. Your dashboard is **LIVE**! 🎉

---

## How It Works

### Architecture
```
Your Vercel App
├── Frontend (React + Vite) → Serves at https://your-app.vercel.app
└── Backend (Serverless Functions) → /api/data and /api/stats
```

### Auto-Refresh
- Data refreshes every 30 seconds automatically
- No need to refresh the page
- Updates appear in real-time

### API Endpoints
- **Data**: `https://your-app.vercel.app/api/data`
- **Stats**: `https://your-app.vercel.app/api/stats`

---

## After Deployment

### Test Your Deployment
1. Visit your Vercel URL
2. Dashboard should load with real data
3. Open browser console - you should see data refreshing every 30s
4. Update Google Sheet and wait 30s to see changes

### Custom Domain (Optional)
1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your custom domain
3. Follow DNS configuration steps

### Monitor
- **Deployments**: Vercel Dashboard → Your Project → Deployments
- **Function Logs**: Click on any deployment → Function Logs
- **Analytics**: Vercel Dashboard → Analytics (free)

---

## Updating Your App

Just push to GitHub:
```bash
git add .
git commit -m "your changes"
git push origin main
```

Vercel automatically redeploys within 1-2 minutes!

---

## Troubleshooting

### "Failed to fetch data" error
- Check Environment Variables are set correctly
- Verify `GOOGLE_CREDENTIALS` is valid JSON
- Check Function Logs in Vercel dashboard

### Data not updating
- Wait 30 seconds (cache duration)
- Check browser console for errors
- Test API directly: visit `https://your-app.vercel.app/api/data`

### Google Sheets permission error
- Ensure service account email has access to the sheet
- Email should be in credentials.json as `client_email`

---

## Free Tier Limits
- **Bandwidth**: 100 GB/month
- **Function Executions**: Unlimited
- **Build Time**: 6000 minutes/month
- **Concurrent Builds**: 1

More than enough for this dashboard! 🎉

---

## That's It!

Your dashboard is now live and will automatically update whenever your Google Sheet changes (with 30-second cache).

**No need for multiple platforms, just Vercel!** ✨
