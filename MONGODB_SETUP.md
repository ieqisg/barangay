# MongoDB + Backend Setup Guide

This guide walks you through setting up MongoDB and connecting your Barangay application to a real backend database.

## Prerequisites

- Node.js 16+ installed
- MongoDB (either local installation or MongoDB Atlas cloud account)

## Option 1: Local MongoDB Setup

### Windows Installation

1. **Download MongoDB Community Edition**
   - Go to https://www.mongodb.com/try/download/community
   - Select your OS (Windows)
   - Download the MSI installer

2. **Install MongoDB**
   - Run the installer
   - Follow the installation wizard
   - Choose "Install MongoDB as a Service" (recommended)
   - Complete the installation

3. **Verify MongoDB is running**
   - MongoDB should start automatically as a Windows service
   - To check: Open Services (services.msc) and look for "MongoDB Server"

4. **Test the connection**
   ```bash
   mongosh
   ```
   If successful, you'll see a MongoDB shell prompt `>`.

## Option 2: MongoDB Atlas Cloud (Recommended for Production)

1. **Create an account**
   - Go to https://www.mongodb.com/cloud/atlas
   - Click "Try Free" and create an account

2. **Create a cluster**
   - After login, click "Create a cluster"
   - Choose the free M0 tier
   - Select a region close to you
   - Click "Create cluster"

3. **Set up database access**
   - In the left menu, click "Database Access"
   - Click "Add New Database User"
   - Set username and password (save these)
   - Click "Add User"

4. **Set up network access**
   - In the left menu, click "Network Access"
   - Click "Add IP Address"
   - Select "Allow access from anywhere" (for development)
   - Click "Confirm"

5. **Get your connection string**
   - Go to "Databases" > "Connect"
   - Select "Drivers"
   - Copy the connection string
   - Replace `<username>` and `<password>` with your credentials
   - Example:
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/barangay?retryWrites=true&w=majority
   ```

## Configure the Backend

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Create `.env` file** (if not already created)
   ```bash
   cp .env.example .env
   ```

3. **Edit `.env` with your MongoDB URI**

   **For local MongoDB:**
   ```
   MONGODB_URI=mongodb://localhost:27017/barangay
   JWT_SECRET=your_secret_key_change_in_production
   PORT=5000
   NODE_ENV=development
   ```

   **For MongoDB Atlas:**
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/barangay?retryWrites=true&w=majority
   JWT_SECRET=your_secret_key_change_in_production
   PORT=5000
   NODE_ENV=development
   ```

## Run the Backend

1. **Install dependencies** (if not already done)
   ```bash
   npm install
   ```

2. **Start the server**
   ```bash
   npm start
   ```

   You should see:
   ```
   ✓ Connected to MongoDB
   ✓ Server running on http://localhost:5000
   ```

3. **Test the server**
   ```bash
   curl http://localhost:5000/health
   ```
   You should get: `{"status":"ok","message":"Server is running"}`

## Connect Frontend to Backend

1. **Create `.env` file in the root directory** (if not already created)
   ```bash
   REACT_APP_API_URL=http://localhost:5000
   ```

2. **Build and run the frontend**
   ```bash
   npm run build
   ```

3. **Serve the frontend**
   ```bash
   npm start
   ```

4. **Test the integration**
   - Register a new account
   - Login
   - Submit a request
   - Check MongoDB to verify data is being stored

## Verify Data in MongoDB

### Using MongoDB Compass (GUI)
1. Download MongoDB Compass from https://www.mongodb.com/products/tools/compass
2. Connect with your MongoDB URI
3. Browse to `barangay` database to see your collections

### Using MongoDB Shell
```bash
mongosh

# Connect to barangay database
use barangay

# Check users
db.users.find()

# Check requests
db.requests.find()

# Check notifications
db.notifications.find()
```

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Backend API URL (set in frontend `.env`) | `http://localhost:5000` |
| `MONGODB_URI` | MongoDB connection string (set in backend `.env`) | `mongodb://localhost:27017/barangay` |
| `JWT_SECRET` | Secret key for JWT tokens (set in backend `.env`) | `your_secret_key` |
| `PORT` | Backend server port (set in backend `.env`) | `5000` |
| `NODE_ENV` | Environment mode (set in backend `.env`) | `development` |

## Troubleshooting

### "Cannot connect to MongoDB"
- Ensure MongoDB is running (check Windows Services or run `mongosh`)
- Check your `MONGODB_URI` is correct
- If using MongoDB Atlas, verify network access is configured

### "JWT verification failed"
- Make sure the same `JWT_SECRET` is set in backend `.env`
- Clear browser localStorage and login again

### "CORS errors"
- The backend is configured to accept requests from any origin
- If you still get CORS errors, check the browser console for the exact error

### "Port 5000 already in use"
- Change the `PORT` in backend `.env` to another port (e.g., 5001)
- Update `REACT_APP_API_URL` in frontend `.env` to match

## Next Steps

1. Test user registration and login
2. Create and submit requests
3. View requests and notifications
4. Assign handlers and update statuses
5. Configure MongoDB backups for production

## Database Indexes

The backend automatically creates indexes for efficient queries:
- `users.email` (unique)
- `requests.userId`
- `notifications.userId, notifications.ts`

## Production Deployment

Before deploying to production:

1. Change `JWT_SECRET` to a strong random value
2. Set `NODE_ENV=production`
3. Use MongoDB Atlas for reliability
4. Enable SSL/TLS for API endpoints
5. Set `REACT_APP_API_URL` to your production API URL
6. Add environment-specific error logging

For deployment options, see the main README.md files in both frontend and backend directories.
