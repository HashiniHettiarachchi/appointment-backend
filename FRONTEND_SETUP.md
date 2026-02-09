# 🎨 FRONTEND SETUP GUIDE - React.js

## Phase 4: Frontend Development

### Step 1: Create React App

Open a NEW terminal (keep backend running in the first terminal) and run:

```bash
cd ..
npx create-react-app frontend
cd frontend
```

This will take 2-3 minutes to complete.

### Step 2: Install Frontend Dependencies

```bash
npm install axios react-router-dom
```

**What these packages do:**
- `axios` - Makes HTTP requests to backend API
- `react-router-dom` - Handles navigation between pages

### Step 3: Project Structure

We'll create this structure:
```
frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── Navbar.js
│   │   ├── Login.js
│   │   ├── Register.js
│   │   ├── ServiceList.js
│   │   ├── BookAppointment.js
│   │   ├── AppointmentList.js
│   │   └── AdminDashboard.js
│   ├── context/
│   │   └── AuthContext.js
│   ├── services/
│   │   └── api.js
│   ├── App.js
│   ├── App.css
│   └── index.js
└── package.json
```

### Step 4: Configure API Connection

Create a `.env` file in frontend folder:

```
REACT_APP_API_URL=http://localhost:5000/api
```

### Step 5: Start Frontend

```bash
npm start
```

This will open `http://localhost:3000` in your browser.

---

## 🔗 How Frontend Connects to Backend

### Example: User Registration Flow

1. **User fills registration form** → Frontend (React)
2. **Form submission** → Axios sends POST request to `http://localhost:5000/api/auth/register`
3. **Backend processes** → Validates data, saves to MongoDB, returns token
4. **Frontend receives response** → Stores token, redirects to dashboard

### Code Example:

```javascript
// In React component
const handleRegister = async (formData) => {
  try {
    const response = await axios.post(
      'http://localhost:5000/api/auth/register',
      formData
    );
    
    // Save token to localStorage
    localStorage.setItem('token', response.data.token);
    
    // Redirect to dashboard
    navigate('/dashboard');
  } catch (error) {
    console.error('Registration failed:', error);
  }
};
```

---

## ✅ Testing Frontend-Backend Connection

### Test 1: CORS Check
When you open frontend (`http://localhost:3000`), check browser console (F12).
- ❌ If you see CORS errors → Backend needs CORS enabled (already done in our code)
- ✅ No CORS errors → Connection is working

### Test 2: Registration Form
1. Fill registration form in frontend
2. Submit form
3. Check browser console (F12) → Should see POST request
4. Check backend terminal → Should see request logged
5. Check MongoDB → New user should be added

---

## 🛠️ Troubleshooting

### Frontend can't connect to backend?
**Check:**
1. Is backend server running? (`npm run dev` in backend folder)
2. Is it running on port 5000?
3. Is frontend `.env` file correct?
4. Check browser console for errors

### "Network Error" in frontend?
**Solution:** Backend is not running or wrong URL in `.env`

### Button clicks do nothing?
**Solution:** Check browser console (F12) for JavaScript errors

---

## 📚 Learning Resources

### For beginners:
1. **React Basics:** https://react.dev/learn
2. **Axios Tutorial:** https://axios-http.com/docs/intro
3. **React Router:** https://reactrouter.com/en/main

### Recommended Learning Path:
1. Understand React components (1-2 days)
2. Learn React hooks (useState, useEffect) (1 day)
3. Practice forms in React (1 day)
4. Learn API calls with Axios (1 day)
5. Build the salon booking frontend (3-5 days)

---

## 🎯 Next Steps

I'll create the complete frontend code for you:
1. API service (axios setup)
2. Authentication context (login/logout state)
3. All components (Login, Register, Booking, etc.)
4. Complete styling

Would you like me to create all the frontend files now?

