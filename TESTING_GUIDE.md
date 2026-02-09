# 🧪 TESTING GUIDE - Salon Booking System Backend

## ✅ CHECKPOINT 1: Database Connection Test

### Step 1: Start MongoDB
**If using local MongoDB:**
- Windows: MongoDB should start automatically
- Mac/Linux: Run `sudo systemctl start mongod` or `brew services start mongodb-community`

**If using MongoDB Atlas (Cloud):**
1. Go to https://cloud.mongodb.com
2. Click on your cluster
3. Click "Connect" → "Connect your application"
4. Copy the connection string
5. Replace in `.env` file:
   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/salon-booking?retryWrites=true&w=majority
   ```
   (Replace username and password with your MongoDB Atlas credentials)

### Step 2: Install Dependencies
```bash
cd backend
npm install
```

### Step 3: Start the Server
```bash
npm run dev
```

**EXPECTED OUTPUT:**
```
✅ Server is running on port 5000
✅ MongoDB Connected Successfully!
```

**❌ If you see errors:**
- "ECONNREFUSED" → MongoDB is not running
- "Authentication failed" → Wrong MongoDB credentials in .env
- "Port 5000 already in use" → Change PORT in .env to 5001

---

## ✅ CHECKPOINT 2: API Testing with Postman

### Setup Postman Collection

#### Test 1: Check if API is Running
**Method:** GET  
**URL:** `http://localhost:5000/`  
**Expected Response:**
```json
{
  "message": "Salon Booking API is running!"
}
```

---

### Test 2: Register a New User (Customer)
**Method:** POST  
**URL:** `http://localhost:5000/api/auth/register`  
**Headers:**
```
Content-Type: application/json
```
**Body (raw JSON):**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "1234567890",
  "role": "customer"
}
```

**Expected Response:**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "65abc123...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer"
  }
}
```

**📝 IMPORTANT:** Copy the `token` value - you'll need it for authenticated requests!

---

### Test 3: Register a Staff Member
**Method:** POST  
**URL:** `http://localhost:5000/api/auth/register`  
**Body:**
```json
{
  "name": "Sarah Stylist",
  "email": "sarah@salon.com",
  "password": "password123",
  "phone": "0987654321",
  "role": "staff"
}
```

---

### Test 4: Register an Admin
**Method:** POST  
**URL:** `http://localhost:5000/api/auth/register`  
**Body:**
```json
{
  "name": "Admin User",
  "email": "admin@salon.com",
  "password": "password123",
  "phone": "1112223333",
  "role": "admin"
}
```

**📝 Copy the admin token for later use!**

---

### Test 5: Login
**Method:** POST  
**URL:** `http://localhost:5000/api/auth/login`  
**Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

---

### Test 6: Get Current User (Protected Route)
**Method:** GET  
**URL:** `http://localhost:5000/api/auth/me`  
**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

Replace `YOUR_TOKEN_HERE` with the token you copied from register/login.

---

### Test 7: Create a Service (Admin Only)
**Method:** POST  
**URL:** `http://localhost:5000/api/services`  
**Headers:**
```
Authorization: Bearer YOUR_ADMIN_TOKEN_HERE
Content-Type: application/json
```
**Body:**
```json
{
  "name": "Haircut",
  "description": "Professional haircut and styling",
  "duration": 60,
  "price": 50,
  "category": "haircut"
}
```

---

### Test 8: Get All Services
**Method:** GET  
**URL:** `http://localhost:5000/api/services`  
**No authentication required**

---

### Test 9: Create an Appointment
**Method:** POST  
**URL:** `http://localhost:5000/api/appointments`  
**Headers:**
```
Authorization: Bearer YOUR_CUSTOMER_TOKEN
Content-Type: application/json
```
**Body:**
```json
{
  "staff": "STAFF_USER_ID_HERE",
  "service": "SERVICE_ID_HERE",
  "appointmentDate": "2026-02-15",
  "startTime": "10:00",
  "endTime": "11:00",
  "notes": "First appointment"
}
```

**Note:** You need to get the `staff` ID and `service` ID from previous tests.

---

### Test 10: Get All Appointments
**Method:** GET  
**URL:** `http://localhost:5000/api/appointments`  
**Headers:**
```
Authorization: Bearer YOUR_TOKEN
```

---

## 🔍 How to Find IDs for Testing

### Get User IDs:
After registering users, check the MongoDB database:

**Option 1 - Using MongoDB Compass:**
1. Download MongoDB Compass
2. Connect to your database
3. Navigate to `salon-booking` → `users` collection
4. Copy the `_id` field

**Option 2 - Add a test route:**
Add this to `server.js` temporarily:
```javascript
app.get('/test/users', async (req, res) => {
  const User = require('./models/User');
  const users = await User.find().select('name email role _id');
  res.json(users);
});
```

Then visit: `http://localhost:5000/test/users`

---

## 📊 Testing Checklist

- [ ] Server starts without errors
- [ ] MongoDB connection successful
- [ ] Can register new users (customer, staff, admin)
- [ ] Can login with valid credentials
- [ ] Cannot login with invalid credentials
- [ ] Can access protected routes with valid token
- [ ] Cannot access protected routes without token
- [ ] Admin can create services
- [ ] Anyone can view services
- [ ] Customer cannot create services (403 error)
- [ ] Can create appointments
- [ ] Can view own appointments
- [ ] Can update appointment status
- [ ] Can cancel appointments

---

## 🐛 Common Issues and Solutions

### Issue: "Cannot POST /api/auth/register"
**Solution:** Make sure server is running and URL is correct

### Issue: "Invalid token"
**Solution:** Token might be expired or incorrectly copied. Login again to get new token

### Issue: "Access denied. Admin only"
**Solution:** You're using a customer/staff token. Use admin token instead

### Issue: "This time slot is already booked"
**Solution:** Change the date or time in your appointment request

### Issue: "Cast to ObjectId failed"
**Solution:** You're using an invalid ID. Make sure to copy the correct ID from database

---

## 💡 Pro Tips

1. **Save tokens in Postman:**
   - In Postman, create an Environment
   - Add variable: `authToken`
   - Set value to your token
   - Use `{{authToken}}` in headers

2. **Organize tests:**
   - Create a Collection in Postman
   - Add all requests to the collection
   - Save the collection for future use

3. **Test in order:**
   - Always register users first
   - Then create services
   - Finally create appointments

---

## 📝 Next Steps After Backend Testing

Once all backend tests pass:
1. ✅ Backend is working correctly
2. Move to Frontend development (React)
3. Connect frontend to backend APIs
4. Build user interface

