# Quick Start Guide

Get the Incident Tracker running in 5 minutes!

## Prerequisites Check

```bash
# Check Node.js (need v16+)
node --version

# Check npm
npm --version

# Check PostgreSQL
psql --version
```

If any are missing, install them first.

## Setup Steps

### 1. Database Setup (2 minutes)

```bash
# Start PostgreSQL (if not running)
# macOS/Linux:
brew services start postgresql
# or
sudo service postgresql start

# Create database
psql -U postgres -c "CREATE DATABASE incident_tracker;"
```

### 2. Backend Setup (1 minute)

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your password
# DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/incident_tracker
nano .env
# or use any text editor

# Start server (this will initialize the database)
npm run dev
```

Keep this terminal open. You should see:
```
Database initialized successfully
Server is running on port 5000
```

### 3. Seed Database (30 seconds)

Open a NEW terminal:

```bash
cd backend
npm run seed
```

You should see:
```
Successfully seeded 200 incidents
```

### 4. Frontend Setup (1 minute)

Open another NEW terminal:

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

You should see:
```
  VITE v5.0.8  ready in 500 ms

  ➜  Local:   http://localhost:3000/
```

### 5. Access the App

Open your browser and go to:
```
http://localhost:3000
```

You should see the Incident Tracker with 200 incidents!

## Quick Test

Try these features:
1. ✓ Click "New Incident" to create one
2. ✓ Use filters to find SEV1 incidents
3. ✓ Search for "timeout"
4. ✓ Click on any incident to view details
5. ✓ Edit an incident's status
6. ✓ Sort by clicking column headers
7. ✓ Navigate through pages

## Common Issues

### "Database does not exist"
```bash
psql -U postgres -c "CREATE DATABASE incident_tracker;"
```

### "Port 5000 already in use"
Edit `backend/.env` and change PORT to 5001

### "Cannot connect to database"
Check your PostgreSQL password in `backend/.env`

### Frontend shows "Network Error"
Make sure backend is running on port 5000

## Stopping the App

Press `Ctrl+C` in each terminal to stop:
1. Backend server
2. Frontend server

## Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Review [API Documentation](README.md#api-documentation)
- Check [GITHUB_SETUP.md](GITHUB_SETUP.md) for submission instructions

## Need Help?

Check the [Troubleshooting](README.md#troubleshooting) section in README.md

---

**That's it!** You now have a fully functional incident tracking system running locally. 🎉