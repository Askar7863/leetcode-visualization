# Deployment Guide

This guide will help you deploy your LeetCode Visualization Dashboard so it automatically updates when your Google Sheet changes.

## Architecture
- **Backend**: Hosted on Render (free tier)
- **Frontend**: Hosted on Vercel (free tier)
- **Auto-refresh**: Configured to update every 30 seconds from Google Sheets

---

## Step 1: Deploy Backend to Render

### 1.1 Create Render Account
1. Go to https://render.com
2. Sign up with your GitHub account
3. Authorize Render to access your repositories

### 1.2 Create New Web Service
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository: `Askar7863/leetcode-visualization`
3. Configure the service:
   - **Name**: `leetcode-dashboard-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`

### 1.3 Add Environment Variables
In the "Environment" section, add these variables:

```
PORT=3001
NODE_ENV=production
SPREADSHEET_ID=1pFtWLyvIHuLhxY6QAijJNalRnvE5pxgvmbVDzsAtA4w
SHEET_NAME=Real data Leetcode
CACHE_TTL=30
ALLOWED_ORIGINS=https://your-frontend-url.vercel.app
```

### 1.4 Upload Google Credentials
1. In Render dashboard, go to your service
2. Click on **"Environment"** tab
3. Click **"Secret Files"**
4. Add a new secret file:
   - **Filename**: `credentials.json`
   - **Contents**: Paste your entire credentials.json content
5. Update your code to read from this path in production

### 1.5 Deploy
1. Click **"Create Web Service"**
2. Wait for deployment (takes 2-3 minutes)
3. Copy your backend URL (e.g., `https://leetcode-dashboard-backend.onrender.com`)

---

## Step 2: Deploy Frontend to Vercel

### 2.1 Create Vercel Account
1. Go to https://vercel.com
2. Sign up with your GitHub account
3. Authorize Vercel to access your repositories

### 2.2 Import Project
1. Click **"Add New..."** → **"Project"**
2. Import `Askar7863/leetcode-visualization`
3. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 2.3 Add Environment Variable
In "Environment Variables" section:

```
VITE_API_URL=https://your-backend-url.onrender.com
```
*(Replace with your actual Render backend URL)*

### 2.4 Deploy
1. Click **"Deploy"**
2. Wait for deployment (1-2 minutes)
3. Your app will be live at `https://your-app.vercel.app`

### 2.5 Update Backend CORS
Go back to Render and update the `ALLOWED_ORIGINS` environment variable:
```
ALLOWED_ORIGINS=https://your-app.vercel.app
```

---

## Step 3: Verify Auto-Refresh

1. Open your deployed app
2. The dashboard should load with real data from Google Sheets
3. Data automatically refreshes every 30 seconds
4. Update your Google Sheet and wait 30 seconds to see changes

---

## Alternative: Deploy Backend to Railway

If Render doesn't work, try Railway:

1. Go to https://railway.app
2. Sign in with GitHub
3. **"New Project"** → **"Deploy from GitHub repo"**
4. Select your repository
5. Add environment variables (same as above)
6. Add `credentials.json` as a secret file
7. Deploy

---

## Alternative: Deploy Both to Vercel (Serverless)

For a simpler setup, you can deploy both to Vercel:

### Backend as Serverless Function:
1. Create `api/data.js` in your root directory
2. Move backend logic to serverless functions
3. Deploy together with frontend

*Note: This requires code restructuring. Contact if you need help with this approach.*

---

## Troubleshooting

### Backend not connecting to Google Sheets
- Verify `credentials.json` is properly uploaded
- Check Render logs for authentication errors
- Ensure service account email has access to the sheet

### CORS errors
- Verify `ALLOWED_ORIGINS` includes your frontend URL
- Check both URLs use HTTPS
- Clear browser cache

### Data not updating
- Check backend logs in Render
- Verify auto-refresh is working (check console logs)
- Test API endpoint directly: `https://your-backend.onrender.com/api/data`

### Free tier limitations
- Render free tier may spin down after 15 minutes of inactivity
- First request after inactivity may take 30-60 seconds
- Consider upgrading to paid tier for production use

---

## Monitoring

### Check Backend Status
Visit: `https://your-backend-url.onrender.com/api/stats`

### View Logs
- **Render**: Dashboard → Your Service → Logs
- **Vercel**: Dashboard → Your Project → Deployments → View Function Logs

---

## Updating Your Deployment

Whenever you push changes to GitHub:
- **Vercel**: Auto-deploys immediately
- **Render**: Auto-deploys immediately

To disable auto-deploy:
- Go to service settings and turn off "Auto-Deploy"

---

## Cost
- **Render Free Tier**: 750 hours/month
- **Vercel Free Tier**: Unlimited bandwidth, 100 GB/month
- **Total**: $0/month for hobby projects

---

## Next Steps

After deployment:
1. ✅ Test the live URL
2. ✅ Verify auto-refresh works
3. ✅ Share the URL with your team
4. ✅ Set up custom domain (optional)
5. ✅ Monitor usage and performance

**Your dashboard will now automatically update whenever your Google Sheet changes!** 🎉
