# 📊 LeetCode Contest Dashboard

A **premium, real-time dashboard** for tracking LeetCode contest performance with live Google Sheets integration, stunning visualizations, and automatic updates.

![Dashboard Preview](https://img.shields.io/badge/Status-Production%20Ready-success?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.2-blue?style=for-the-badge&logo=react)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.3-06B6D4?style=for-the-badge&logo=tailwindcss)
![ECharts](https://img.shields.io/badge/ECharts-5.4-red?style=for-the-badge)

---

## ✨ Features

### 🔄 **Real-Time Auto-Sync**
- ✅ Fetches data from Google Sheets API v4
- ✅ Auto-refreshes every 30 seconds
- ✅ Smooth transitions without page reload
- ✅ SWR for optimized data fetching and caching

### 📈 **Advanced Visualizations**
- ✅ Rating trend bar charts
- ✅ Problems solved horizontal bar charts
- ✅ Contest performance line/bar charts
- ✅ Performance heatmaps
- ✅ Animated transitions with ECharts

### 🎨 **Modern UI/UX**
- ✅ Dark/Light mode toggle
- ✅ Smooth animations
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Professional gradient colors
- ✅ Medal icons (🥇 🥈 🥉) for top rankers

### 🔍 **Interactive Filters**
- ✅ Search by name, LeetCode ID, or register number
- ✅ Sort by rating, problems solved, or name
- ✅ Filter by specific contests
- ✅ Real-time updates on filter changes

### 🏆 **Dynamic Leaderboard**
- ✅ Auto-updating ranks
- ✅ Color-coded badges
- ✅ Contest-specific leaderboards
- ✅ Direct links to LeetCode profiles

### 🔐 **Secure Backend Proxy**
- ✅ Node.js + Express server
- ✅ API key protection
- ✅ Response caching (30s TTL)
- ✅ Auto-refresh mechanism

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Google Sheets API Key**

### 1️⃣ **Get Google Sheets API Key**

#### Option A: Using Google Cloud Console (Recommended)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable **Google Sheets API**:
   - Navigate to "APIs & Services" > "Library"
   - Search for "Google Sheets API"
   - Click "Enable"
4. Create API credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy the API key
5. **Make your Google Sheet public**:
   - Open your Google Sheet
   - Click "Share" button
   - Change to "Anyone with the link can view"

#### Option B: Using Quick Setup
```bash
# Use the Google API Console
https://console.developers.google.com/apis/api/sheets.googleapis.com
```

### 2️⃣ **Backend Setup**

```powershell
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create .env file
Copy-Item .env.example .env

# Edit .env file with your API key
notepad .env
```

**Edit `.env` file:**
```env
GOOGLE_SHEETS_API_KEY=YOUR_API_KEY_HERE
SPREADSHEET_ID=1pFtWLyvIHuLhxY6QAijJNalRnvE5pxgvmbVDzsAtA4w
SHEET_NAME=WhatsApp Contest Tracker
PORT=3001
CACHE_TTL=30
```

**Start the backend:**
```powershell
npm start
# Or for development with auto-reload:
npm run dev
```

Server will run on `http://localhost:3001`

### 3️⃣ **Frontend Setup**

```powershell
# Open new terminal and navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will run on `http://localhost:5173`

### 4️⃣ **Access Dashboard**

Open your browser and go to:
```
http://localhost:5173
```

---

## 📁 Project Structure

```
leetcode-contest-dashboard/
│
├── backend/
│   ├── server.js              # Express server with Google Sheets integration
│   ├── package.json           # Backend dependencies
│   ├── .env.example           # Environment variables template
│   └── .env                   # Your API keys (create this)
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.jsx          # Main dashboard container
│   │   │   ├── Leaderboard.jsx        # Leaderboard table
│   │   │   ├── FilterBar.jsx          # Search & filter controls
│   │   │   ├── RatingChart.jsx        # Rating bar chart
│   │   │   ├── ContestChart.jsx       # Contest performance chart
│   │   │   ├── HeatmapChart.jsx       # Performance heatmap
│   │   │   ├── ProblemsSolvedChart.jsx # Problems solved chart
│   │   │   └── ThemeToggle.jsx        # Dark/Light mode toggle
│   │   │
│   │   ├── hooks/
│   │   │   └── useSheetData.js        # SWR hook for data fetching
│   │   │
│   │   ├── utils/
│   │   │   └── dataProcessor.js       # Data processing utilities
│   │   │
│   │   ├── App.jsx                    # Root component
│   │   ├── main.jsx                   # Entry point
│   │   └── index.css                  # Global styles
│   │
│   ├── package.json           # Frontend dependencies
│   ├── vite.config.js         # Vite configuration
│   ├── tailwind.config.js     # Tailwind CSS configuration
│   └── postcss.config.js      # PostCSS configuration
│
└── README.md                  # This file
```

---

## 🔧 Configuration

### Backend Configuration (`backend/.env`)

| Variable | Description | Default |
|----------|-------------|---------|
| `GOOGLE_SHEETS_API_KEY` | Your Google Sheets API key | Required |
| `SPREADSHEET_ID` | Google Sheet ID from URL | Required |
| `SHEET_NAME` | Name of the sheet tab | "WhatsApp Contest Tracker" |
| `PORT` | Backend server port | 3001 |
| `CACHE_TTL` | Cache time-to-live (seconds) | 30 |
| `ALLOWED_ORIGINS` | CORS allowed origins | localhost:5173,localhost:3000 |

### Frontend Configuration

Create `frontend/.env.local` (optional):
```env
VITE_API_URL=http://localhost:3001
```

---

## 🎨 Features Deep Dive

### 1. **Auto-Refresh Mechanism**

The dashboard uses **SWR (stale-while-revalidate)** for optimal data fetching:

```javascript
// Automatically refetches every 30 seconds
const { data } = useSWR('/api/data', fetcher, {
  refreshInterval: 30000,
  revalidateOnFocus: true,
  revalidateOnReconnect: true
});
```

Backend also auto-refreshes cache:
```javascript
setInterval(async () => {
  const data = await fetchSheetData();
  cache.set('sheetData', data);
}, 30000);
```

### 2. **Interactive Charts**

All charts are built with **ECharts** and support:
- Responsive design
- Dark/Light mode
- Smooth animations
- Interactive tooltips
- Real-time updates

### 3. **Leaderboard Features**

- **Medal System**: 🥇 🥈 🥉 for top 3
- **Color-coded badges**: Gold, Silver, Bronze, Blue
- **Direct LeetCode links**: Click to view profiles
- **Contest-specific rankings**: Filter by individual contests

### 4. **Search & Filter**

- **Search**: Instant filtering by name, LeetCode ID, or register number
- **Sort**: By rating, problems solved, or name
- **Contest Filter**: View specific contest leaderboards
- **Real-time updates**: All filters work instantly

---

## 📊 API Endpoints

### Backend REST API

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/data` | GET | Get all sheet data |
| `/api/stats` | GET | Get statistics summary |
| `/api/refresh` | POST | Manually refresh cache |
| `/api/health` | GET | Health check |

#### Example Response (`/api/data`):

```json
{
  "data": [
    {
      "id": 1,
      "sNo": "1",
      "registerNumber": "RA2111003011234",
      "name": "John Doe",
      "leetcodeId": "johndoe",
      "problemsSolved": 250,
      "rating": 1850,
      "contests": {
        "Weekly Contest 380": 12,
        "Biweekly Contest 120": 15
      }
    }
  ],
  "contestNames": ["Weekly Contest 380", "Biweekly Contest 120"],
  "lastUpdated": "2025-12-10T10:30:00.000Z",
  "totalStudents": 50,
  "fromCache": true
}
```

---

## 🎯 Deployment

### Option 1: Deploy to Vercel (Frontend) + Render (Backend)

#### **Backend on Render:**

1. Push your code to GitHub
2. Go to [Render](https://render.com/)
3. Create new "Web Service"
4. Connect your GitHub repo
5. Set root directory to `backend`
6. Add environment variables
7. Deploy!

#### **Frontend on Vercel:**

```powershell
cd frontend

# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variable
vercel env add VITE_API_URL
# Enter your Render backend URL
```

### Option 2: Deploy Both to Vercel

```powershell
# Deploy backend as serverless function
# (Convert server.js to Vercel serverless format)

# Deploy frontend
cd frontend
vercel --prod
```

### Option 3: Deploy to AWS/DigitalOcean

```powershell
# Build frontend
cd frontend
npm run build

# Upload dist/ folder to S3 or server
# Run backend with PM2:
pm2 start backend/server.js --name leetcode-backend
```

---

## 🔒 Security Best Practices

### ✅ **Do:**
- Store API keys in `.env` files
- Add `.env` to `.gitignore`
- Use backend proxy to hide API keys
- Enable CORS only for trusted origins
- Make Google Sheet "View Only" public

### ❌ **Don't:**
- Commit API keys to Git
- Expose API keys in frontend code
- Allow sheet editing via API
- Skip input validation

---

## 🐛 Troubleshooting

### Issue: "Failed to fetch data"

**Solution:**
1. Check if backend is running (`http://localhost:3001/api/health`)
2. Verify API key in `.env`
3. Ensure Google Sheet is public (View access)
4. Check SPREADSHEET_ID is correct

### Issue: "No data found in sheet"

**Solution:**
1. Verify SHEET_NAME matches exactly
2. Check sheet has data in row 1 (headers)
3. Ensure sheet isn't empty

### Issue: Charts not showing

**Solution:**
1. Check browser console for errors
2. Verify data structure matches expected format
3. Clear browser cache
4. Try toggling dark/light mode

### Issue: CORS errors

**Solution:**
```javascript
// In backend/server.js, update CORS:
app.use(cors({
  origin: '*' // Allow all origins (development only)
}));
```

---

## 📱 Responsive Design

The dashboard is fully responsive and optimized for:

- 📱 **Mobile** (320px - 768px)
- 📋 **Tablet** (768px - 1024px)
- 🖥️ **Desktop** (1024px+)
- 🖥️ **Large Desktop** (1920px+)

---

## 🎨 Customization

### Change Theme Colors

Edit `frontend/tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        500: '#your-color',
        600: '#your-darker-color',
      },
    },
  },
}
```

### Adjust Refresh Interval

**Frontend** (`frontend/src/hooks/useSheetData.js`):
```javascript
refreshInterval: 60000, // 60 seconds
```

**Backend** (`backend/server.js`):
```javascript
}, 60000); // 60 seconds
```

### Add New Charts

1. Create new component in `frontend/src/components/`
2. Import in `Dashboard.jsx`
3. Add to grid layout

---

## 🚀 Future Enhancements

Potential features to add:

- [ ] **Student detail pages** with individual performance graphs
- [ ] **Export to PDF/Excel** functionality
- [ ] **Email notifications** for contest reminders
- [ ] **Historical data tracking** with time-series graphs
- [ ] **Contest predictions** using ML models
- [ ] **Multi-sheet support** for different batches
- [ ] **Admin panel** for manual data entry
- [ ] **Authentication** for protected access
- [ ] **Real-time collaboration** features
- [ ] **Mobile app** (React Native)

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 18** | Frontend framework |
| **Vite** | Build tool |
| **TailwindCSS** | Styling |
| **ECharts** | Data visualization |
| **SWR** | Data fetching |
| **Axios** | HTTP client |
| **Lucide React** | Icons |
| **Framer Motion** | Animations |
| **Node.js** | Backend runtime |
| **Express** | Web framework |
| **Google Sheets API** | Data source |
| **node-cache** | Server-side caching |

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📞 Support

For issues or questions:
- Open an issue on GitHub
- Check the troubleshooting section above

---

## ⭐ Acknowledgments

- Google Sheets API for data integration
- ECharts for amazing visualization library
- Vercel for easy deployment
- TailwindCSS for rapid styling

---

**Built with ❤️ for tracking LeetCode contest performance**

---

## 📝 Quick Commands Reference

```powershell
# Backend
cd backend
npm install           # Install dependencies
npm start            # Start production server
npm run dev          # Start dev server with nodemon

# Frontend
cd frontend
npm install          # Install dependencies
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build

# Both at once (from root)
# Terminal 1
cd backend ; npm start

# Terminal 2
cd frontend ; npm run dev
```

---

**🎉 Your dashboard is now ready to track LeetCode contests in real-time!**
