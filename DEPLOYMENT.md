# Deployment Guide

This guide covers multiple deployment options for the LeetCode Contest Dashboard.

---

## 🎯 Deployment Options

1. **Vercel + Render** (Recommended - Free tier available)
2. **Netlify + Railway** (Alternative - Free tier)
3. **AWS** (Production - Paid)
4. **Docker** (Self-hosted)
5. **Traditional VPS** (DigitalOcean, Linode)

---

## 🚀 Option 1: Vercel (Frontend) + Render (Backend)

### Why This Stack?
- ✅ Free tier available
- ✅ Easy deployment
- ✅ Auto-scaling
- ✅ Global CDN
- ✅ HTTPS by default

### A. Deploy Backend to Render

#### Step 1: Prepare Repository

```powershell
# Initialize git (if not already)
git init
git add .
git commit -m "Initial commit"

# Push to GitHub
git remote add origin https://github.com/yourusername/leetcode-dashboard.git
git branch -M main
git push -u origin main
```

#### Step 2: Deploy on Render

1. Go to [Render.com](https://render.com/)
2. Sign up / Log in with GitHub
3. Click **"New +"** → **"Web Service"**
4. Connect your GitHub repository
5. Configure:
   - **Name**: `leetcode-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: `Free`

6. Add Environment Variables:
   ```
   GOOGLE_SHEETS_API_KEY=your_api_key
   SPREADSHEET_ID=1pFtWLyvIHuLhxY6QAijJNalRnvE5pxgvmbVDzsAtA4w
   SHEET_NAME=WhatsApp Contest Tracker
   PORT=3001
   CACHE_TTL=30
   ALLOWED_ORIGINS=https://your-frontend-url.vercel.app
   ```

7. Click **"Create Web Service"**
8. Wait for deployment (2-3 minutes)
9. Copy your backend URL: `https://leetcode-backend.onrender.com`

### B. Deploy Frontend to Vercel

#### Step 1: Update API URL

Create `frontend/.env.production`:

```env
VITE_API_URL=https://leetcode-backend.onrender.com
```

#### Step 2: Deploy to Vercel

```powershell
cd frontend

# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow prompts:
# Set up and deploy? Y
# Which scope? (choose your account)
# Link to existing project? N
# Project name? leetcode-dashboard
# Directory? ./
# Override settings? N

# Deploy to production
vercel --prod
```

#### Step 3: Configure Environment Variable

```powershell
# Add environment variable
vercel env add VITE_API_URL production

# Enter: https://leetcode-backend.onrender.com

# Redeploy
vercel --prod
```

#### Step 4: Update CORS on Backend

Go back to Render and update `ALLOWED_ORIGINS`:
```
ALLOWED_ORIGINS=https://your-app.vercel.app,https://your-app-git-main.vercel.app
```

---

## 🚀 Option 2: Netlify + Railway

### A. Deploy Backend to Railway

1. Go to [Railway.app](https://railway.app/)
2. Sign in with GitHub
3. Click **"New Project"** → **"Deploy from GitHub repo"**
4. Select your repository
5. Add service → **"GitHub Repo"**
6. Configure:
   - **Root Directory**: `/backend`
   - **Start Command**: `npm start`

7. Add Variables (in Railway dashboard):
   ```
   GOOGLE_SHEETS_API_KEY=your_api_key
   SPREADSHEET_ID=1pFtWLyvIHuLhxY6QAijJNalRnvE5pxgvmbVDzsAtA4w
   SHEET_NAME=WhatsApp Contest Tracker
   PORT=3001
   ```

8. Generate Domain in Settings
9. Copy URL: `https://your-app.up.railway.app`

### B. Deploy Frontend to Netlify

```powershell
cd frontend

# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Build
npm run build

# Deploy
netlify deploy --prod --dir=dist

# Set environment variable in Netlify dashboard
```

Or use Netlify UI:
1. Go to [Netlify](https://netlify.com/)
2. Drag & drop the `dist` folder
3. Add environment variable in Site Settings

---

## 🚀 Option 3: AWS (Production)

### Architecture:
- **Frontend**: S3 + CloudFront
- **Backend**: EC2 or Lambda
- **Database**: RDS (if needed later)

### A. Deploy Backend to EC2

#### Launch EC2 Instance:

```bash
# Connect to instance
ssh -i your-key.pem ec2-user@your-instance-ip

# Install Node.js
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Clone repository
git clone https://github.com/yourusername/leetcode-dashboard.git
cd leetcode-dashboard/backend

# Install dependencies
npm install

# Install PM2
sudo npm install -g pm2

# Create .env file
nano .env
# (paste your environment variables)

# Start with PM2
pm2 start server.js --name leetcode-backend
pm2 save
pm2 startup

# Configure firewall
sudo firewall-cmd --permanent --add-port=3001/tcp
sudo firewall-cmd --reload
```

### B. Deploy Frontend to S3 + CloudFront

```powershell
# Build frontend
cd frontend
npm run build

# Install AWS CLI
# Follow: https://aws.amazon.com/cli/

# Configure AWS CLI
aws configure

# Create S3 bucket
aws s3 mb s3://leetcode-dashboard

# Upload files
aws s3 sync dist/ s3://leetcode-dashboard

# Configure bucket for static website
aws s3 website s3://leetcode-dashboard --index-document index.html

# Create CloudFront distribution (via AWS Console)
# Point origin to S3 bucket
```

---

## 🚀 Option 4: Docker Deployment

### Create Docker Files

#### `backend/Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 3001

CMD ["npm", "start"]
```

#### `frontend/Dockerfile`:

```dockerfile
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### `docker-compose.yml` (root directory):

```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "3001:3001"
    environment:
      - GOOGLE_SHEETS_API_KEY=${GOOGLE_SHEETS_API_KEY}
      - SPREADSHEET_ID=${SPREADSHEET_ID}
      - SHEET_NAME=${SHEET_NAME}
    restart: unless-stopped

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: unless-stopped
```

### Deploy with Docker:

```powershell
# Create .env file in root
Copy-Item backend\.env.example .env

# Build and run
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

---

## 🚀 Option 5: Traditional VPS (DigitalOcean)

### Setup:

```bash
# Connect to droplet
ssh root@your-droplet-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Nginx
sudo apt install nginx

# Clone repository
git clone https://github.com/yourusername/leetcode-dashboard.git
cd leetcode-dashboard

# Setup backend
cd backend
npm install
nano .env  # Add your variables
sudo npm install -g pm2
pm2 start server.js --name leetcode-backend
pm2 save
pm2 startup

# Setup frontend
cd ../frontend
npm install
npm run build

# Configure Nginx
sudo nano /etc/nginx/sites-available/leetcode-dashboard
```

#### Nginx Configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        root /root/leetcode-dashboard/frontend/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/leetcode-dashboard /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Setup SSL with Let's Encrypt
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

## 🔒 Post-Deployment Security

### 1. Environment Variables
- Never commit `.env` files
- Use deployment platform's environment variable features
- Rotate API keys regularly

### 2. HTTPS
- Always use HTTPS in production
- Vercel/Netlify provide this automatically
- Use Let's Encrypt for VPS

### 3. CORS
- Restrict CORS to your frontend domain only
- Update `ALLOWED_ORIGINS` in backend

### 4. Rate Limiting

Add to `backend/server.js`:

```javascript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

---

## 📊 Monitoring

### 1. Vercel Analytics
- Enable in Vercel dashboard
- View real-time traffic and performance

### 2. Render Logs
- View logs in Render dashboard
- Set up log drains for long-term storage

### 3. Uptime Monitoring
Use services like:
- UptimeRobot (free)
- Pingdom
- StatusCake

---

## 🔄 CI/CD Pipeline

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: cd backend && npm install
      - run: cd backend && npm test  # if you have tests
      # Deploy to Render automatically on push

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: cd frontend && npm install
      - run: cd frontend && npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

---

## ✅ Deployment Checklist

Before going live:

- [ ] Backend environment variables set
- [ ] Frontend API URL configured
- [ ] Google Sheet is public
- [ ] CORS configured correctly
- [ ] HTTPS enabled
- [ ] Domain DNS configured
- [ ] Error monitoring setup
- [ ] Backups configured (if applicable)
- [ ] Rate limiting enabled
- [ ] Security headers configured
- [ ] Analytics enabled
- [ ] Tested in production environment

---

## 🎉 You're Live!

Your dashboard is now deployed and accessible to users worldwide!

**Next steps:**
- Share the URL with your team
- Monitor usage and performance
- Gather user feedback
- Plan future enhancements

---

Need help? Check troubleshooting section in main README.md
