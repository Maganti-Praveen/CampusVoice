# 🚀 Render Deployment Guide for Campus Voice Backend

## ✅ Backend is Now Deploy-Ready!

All necessary changes have been applied to make the backend production-ready for Render deployment.

---

## 📋 Changes Applied

### 1. **server.js Updates**
- ✅ Global CORS middleware configured: `cors({ origin: "*", credentials: true })`
- ✅ MongoDB connection uses environment variable: `process.env.MONGO_URL`
- ✅ Database name set to: `CampusVoice`
- ✅ Port configuration: `process.env.PORT || 5000`
- ✅ Removed localhost references from console logs
- ✅ Production-ready error handling

### 2. **.env Configuration**
- ✅ `MONGO_URL` variable created
- ✅ `PORT` set to 5000
- ✅ `JWT_SECRET` configured

### 3. **package.json Scripts**
- ✅ `"start": "node server.js"` - Production command
- ✅ `"dev": "nodemon server.js"` - Development command

---

## 🌐 Deploy to Render

### Step 1: Create New Web Service
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository: `Maganti-Praveen/CampusVoice`

### Step 2: Configure Build Settings

| Setting | Value |
|---------|-------|
| **Name** | `campus-voice-backend` (or your choice) |
| **Root Directory** | `backend` |
| **Environment** | `Node` |
| **Region** | Choose closest to you |
| **Branch** | `main` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |

### Step 3: Add Environment Variables

Click **"Advanced"** → **"Add Environment Variable"** and add:

```ini
MONGO_URL=mongodb+srv://sai:sai1234@saicl1.fud71oe.mongodb.net/?appName=saicl1
PORT=5000
JWT_SECRET=campus_complaint_secret_key_2025
```

### Step 4: Deploy
1. Click **"Create Web Service"**
2. Wait for deployment to complete (3-5 minutes)
3. Copy your backend URL (e.g., `https://campus-voice-backend.onrender.com`)

---

## 🔗 After Deployment

### Your Backend URL
Once deployed, your API will be available at:
```
https://your-service-name.onrender.com
```

### Test Endpoints
- Root: `GET /`
- Auth: `POST /api/auth/login`, `POST /api/auth/register`
- Complaints: `GET /api/complaints`, `POST /api/complaints`
- Feedback: `GET /api/feedback`, `POST /api/feedback`

### Management Account
The default management account will be automatically created on first deployment:
- **Email**: management@rcee.ac.in
- **Password**: 1234

---

## 🎯 Next Steps

1. ✅ **Backend is ready** - Deploy on Render following the steps above
2. 📱 **Frontend Update** - After backend deployment, update frontend `.env` with:
   ```
   VITE_API_URL=https://your-render-backend-url.onrender.com
   ```
3. 🌐 **Frontend Deploy** - Deploy frontend on Vercel/Netlify

---

## 🔒 Security Notes

- The backend uses wildcard CORS (`origin: "*"`) for development convenience
- For production, consider restricting CORS to your frontend domain
- Change JWT_SECRET to a stronger value in production
- Consider implementing password hashing (currently using plain text as per requirements)

---

## 📞 Support

If deployment fails:
1. Check Render logs for errors
2. Verify environment variables are set correctly
3. Ensure MongoDB Atlas IP whitelist includes `0.0.0.0/0` (allow all)
4. Check that your MongoDB connection string is correct

---

**Status**: ✅ **DEPLOY-READY**
