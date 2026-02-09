# 🚀 QUICK REFERENCE CHEAT SHEET

## Essential Commands

### Backend Commands
```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Start server (development mode - auto-restart)
npm run dev

# Start server (production mode)
npm start

# Stop server
Ctrl + C
```

### Frontend Commands
```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

### MongoDB Commands
```bash
# Start MongoDB (Windows - usually automatic)
# No command needed

# Start MongoDB (Mac)
brew services start mongodb-community

# Start MongoDB (Linux)
sudo systemctl start mongod

# Check MongoDB status
mongosh
```

---

## File Locations

### Backend Files
```
/backend/.env                    → Environment variables
/backend/server.js               → Main entry point
/backend/config/db.js           → Database connection
/backend/models/User.js         → User database schema
/backend/routes/auth.js         → Login/register endpoints
```

### Frontend Files
```
/frontend/.env                   → API URL configuration
/frontend/src/App.js            → Main React component
/frontend/src/components/       → UI components folder
```

---

## Important URLs

| Service | URL | Purpose |
|---------|-----|---------|
| Backend API | http://localhost:5000 | REST API server |
| Frontend | http://localhost:3000 | React app |
| MongoDB Local | mongodb://localhost:27017 | Local database |

---

## Common Code Snippets

### Make API Call (Frontend)
```javascript
import axios from 'axios';

// GET request
const response = await axios.get('http://localhost:5000/api/services');

// POST request
const response = await axios.post('http://localhost:5000/api/auth/login', {
  email: 'user@example.com',
  password: 'password123'
});

// With authentication token
const response = await axios.get('http://localhost:5000/api/appointments', {
  headers: {
    Authorization: `Bearer ${token}`
  }
});
```

### Create React Component
```javascript
import React, { useState } from 'react';

function MyComponent() {
  const [data, setData] = useState('');

  return (
    <div>
      <h1>Hello</h1>
      <p>{data}</p>
    </div>
  );
}

export default MyComponent;
```

---

## Postman Quick Setup

### Headers for Auth Required Endpoints
```
Key: Authorization
Value: Bearer YOUR_TOKEN_HERE

Key: Content-Type
Value: application/json
```

### Common Test URLs
```
GET    http://localhost:5000/
POST   http://localhost:5000/api/auth/register
POST   http://localhost:5000/api/auth/login
GET    http://localhost:5000/api/services
POST   http://localhost:5000/api/appointments
```

---

## Debugging Quick Checks

### ❌ Backend won't start?
1. Is MongoDB running?
2. Is `.env` file present in backend folder?
3. Did you run `npm install`?
4. Is port 5000 already in use?

### ❌ Frontend can't connect?
1. Is backend running on port 5000?
2. Check `.env` in frontend folder
3. Open browser console (F12) for errors
4. Check Network tab in browser dev tools

### ❌ API returns 401 Unauthorized?
1. Did you include Authorization header?
2. Is token valid (not expired)?
3. Format: `Bearer YOUR_TOKEN` (with space)

### ❌ API returns 500 Server Error?
1. Check backend terminal for error details
2. Verify MongoDB is connected
3. Check request body format
4. Verify all required fields are sent

---

## Project Checklist

### Initial Setup
- [ ] Node.js installed
- [ ] MongoDB installed/configured
- [ ] VS Code installed
- [ ] Postman installed
- [ ] Project folders created

### Backend Development
- [ ] Dependencies installed (`npm install`)
- [ ] `.env` file created with correct values
- [ ] Server starts without errors
- [ ] MongoDB connection successful
- [ ] All models created
- [ ] All routes created
- [ ] Can register user in Postman
- [ ] Can login in Postman
- [ ] Can create service in Postman
- [ ] Can create appointment in Postman

### Frontend Development
- [ ] React app created
- [ ] Dependencies installed
- [ ] `.env` file created
- [ ] Can make API calls to backend
- [ ] Login page works
- [ ] Register page works
- [ ] Services display correctly
- [ ] Can book appointment from UI

---

## Environment Variables Template

### Backend `.env`
```env
MONGO_URI=mongodb://localhost:27017/salon-booking
JWT_SECRET=change_this_to_random_string_123456
PORT=5000
```

### Frontend `.env`
```env
REACT_APP_API_URL=http://localhost:5000/api
```

---

## Testing Order

1. ✅ Test backend server starts
2. ✅ Test MongoDB connection
3. ✅ Test user registration (Postman)
4. ✅ Test user login (Postman)
5. ✅ Test creating service (Postman)
6. ✅ Test creating appointment (Postman)
7. ✅ Test frontend starts
8. ✅ Test frontend API connection
9. ✅ Test login from browser
10. ✅ Test booking from browser

---

## Keyboard Shortcuts

### VS Code
- `Ctrl + S` - Save file
- `Ctrl + ~` - Open terminal
- `Ctrl + B` - Toggle sidebar
- `Ctrl + P` - Quick file open
- `F12` - Go to definition

### Browser
- `F12` - Open developer tools
- `Ctrl + Shift + R` - Hard refresh
- `Ctrl + Shift + I` - Open inspector

### Terminal
- `Ctrl + C` - Stop running process
- `Ctrl + L` or `clear` - Clear terminal
- `↑` arrow - Previous command

---

## Default Test Credentials

After running initial tests, use these:

**Admin:**
```
Email: admin@salon.com
Password: password123
```

**Staff:**
```
Email: sarah@salon.com
Password: password123
```

**Customer:**
```
Email: john@example.com
Password: password123
```

---

## Package Versions (Known Working)

```json
{
  "express": "^4.18.2",
  "mongoose": "^8.0.0",
  "react": "^18.2.0",
  "axios": "^1.6.0",
  "bcryptjs": "^2.4.3",
  "jsonwebtoken": "^9.0.2"
}
```

---

## Emergency Recovery

### Start Fresh
```bash
# Delete node_modules
rm -rf node_modules

# Delete package-lock.json
rm package-lock.json

# Reinstall
npm install
```

### Reset Database
```bash
# In MongoDB shell (mongosh)
use salon-booking
db.dropDatabase()
```

---

## Common Error Messages

| Error | Meaning | Solution |
|-------|---------|----------|
| EADDRINUSE | Port already in use | Change port or kill process |
| ECONNREFUSED | Can't connect to MongoDB | Start MongoDB service |
| Invalid token | JWT error | Login again to get new token |
| 404 Not Found | Wrong URL | Check endpoint spelling |
| 500 Server Error | Backend crash | Check backend terminal |
| CORS error | Frontend-backend connection | Check CORS in server.js |

---

## Resources Links

- Node.js Docs: https://nodejs.org/docs
- Express Docs: https://expressjs.com
- React Docs: https://react.dev
- MongoDB Docs: https://docs.mongodb.com
- Axios Docs: https://axios-http.com
- Stack Overflow: https://stackoverflow.com

---

## Daily Workflow

### Every Day When Starting:
1. Open VS Code
2. Open 2 terminals
3. Terminal 1: `cd backend && npm run dev`
4. Terminal 2: `cd frontend && npm start`
5. Open Postman
6. Open browser to localhost:3000

### Before Closing:
1. Stop both servers (Ctrl+C)
2. Commit changes (if using git)
3. Close VS Code

---

**Print this and keep it handy! 📄**

