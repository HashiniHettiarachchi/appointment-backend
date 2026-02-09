# 💈 Salon Booking System - MERN Stack

A complete web-based salon appointment booking system built with MongoDB, Express.js, React.js, and Node.js.

## 📋 Features

### For Customers
- ✅ User registration and login
- ✅ Browse available services
- ✅ Book appointments with preferred staff
- ✅ View appointment history
- ✅ Cancel/reschedule appointments
- ✅ Receive booking confirmations

### For Staff
- ✅ View assigned appointments
- ✅ Manage availability
- ✅ Confirm/reject appointments
- ✅ Update appointment status

### For Administrators
- ✅ Manage all appointments
- ✅ Add/edit/delete services
- ✅ Manage staff members
- ✅ View booking statistics
- ✅ Generate reports

## 🛠️ Technology Stack

**Frontend:**
- React.js 18+
- React Router for navigation
- Axios for API calls
- CSS3 for styling

**Backend:**
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Bcrypt for password hashing

## 📁 Project Structure

```
salon-booking-system/
├── backend/
│   ├── config/
│   │   └── db.js                 # Database connection
│   ├── models/
│   │   ├── User.js               # User schema
│   │   ├── Service.js            # Service schema
│   │   └── Appointment.js        # Appointment schema
│   ├── routes/
│   │   ├── auth.js               # Authentication routes
│   │   ├── services.js           # Service routes
│   │   └── appointments.js       # Appointment routes
│   ├── middleware/
│   │   └── auth.js               # JWT verification
│   ├── .env                      # Environment variables
│   ├── server.js                 # Entry point
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.js
    │   │   ├── Login.js
    │   │   ├── Register.js
    │   │   ├── ServiceList.js
    │   │   ├── BookAppointment.js
    │   │   └── AppointmentList.js
    │   ├── context/
    │   │   └── AuthContext.js
    │   ├── services/
    │   │   └── api.js
    │   └── App.js
    └── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn

### Installation

#### 1. Clone or Download the Project
```bash
cd salon-booking-system
```

#### 2. Backend Setup
```bash
cd backend
npm install
```

Create `.env` file in backend folder:
```env
MONGO_URI=mongodb://localhost:27017/salon-booking
JWT_SECRET=your_secret_key_here
PORT=5000
```

For MongoDB Atlas, use this format:
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/salon-booking
```

#### 3. Start Backend Server
```bash
npm run dev
```

You should see:
```
✅ Server is running on port 5000
✅ MongoDB Connected Successfully!
```

#### 4. Frontend Setup (in new terminal)
```bash
cd frontend
npm install
```

Create `.env` file in frontend folder:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

#### 5. Start Frontend
```bash
npm start
```

Frontend will open at `http://localhost:3000`

## 🧪 Testing with Postman

### 1. Import Postman Collection
- See `TESTING_GUIDE.md` for detailed API testing instructions

### 2. Quick Test Endpoints

**Test Server:**
```
GET http://localhost:5000/
```

**Register User:**
```
POST http://localhost:5000/api/auth/register
Body:
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "1234567890",
  "role": "customer"
}
```

**Login:**
```
POST http://localhost:5000/api/auth/login
Body:
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Get Services:**
```
GET http://localhost:5000/api/services
```

## 📊 Database Schema

### User Collection
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  role: String (customer/staff/admin),
  specialization: String (for staff),
  availability: Array (for staff)
}
```

### Service Collection
```javascript
{
  name: String,
  description: String,
  duration: Number (minutes),
  price: Number,
  category: String,
  isActive: Boolean
}
```

### Appointment Collection
```javascript
{
  customer: ObjectId (ref: User),
  staff: ObjectId (ref: User),
  service: ObjectId (ref: Service),
  appointmentDate: Date,
  startTime: String,
  endTime: String,
  status: String (pending/confirmed/cancelled/completed),
  notes: String
}
```

## 🔐 API Authentication

All protected routes require JWT token in header:
```
Authorization: Bearer YOUR_TOKEN_HERE
```

## 🎯 User Roles & Permissions

| Action | Customer | Staff | Admin |
|--------|----------|-------|-------|
| Book Appointment | ✅ | ❌ | ✅ |
| View Own Appointments | ✅ | ✅ | ✅ |
| View All Appointments | ❌ | ❌ | ✅ |
| Create Service | ❌ | ❌ | ✅ |
| Edit Service | ❌ | ❌ | ✅ |
| Delete Service | ❌ | ❌ | ✅ |

## 📝 Environment Variables

### Backend (.env)
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 🐛 Troubleshooting

### Backend won't start
- ✅ Check if MongoDB is running
- ✅ Verify .env file exists and has correct values
- ✅ Check if port 5000 is available
- ✅ Run `npm install` again

### Frontend can't connect to backend
- ✅ Verify backend is running on port 5000
- ✅ Check REACT_APP_API_URL in frontend .env
- ✅ Check browser console for CORS errors
- ✅ Verify axios is installed

### Database connection failed
- ✅ Check MongoDB service is running
- ✅ Verify MONGO_URI is correct
- ✅ For Atlas: Check username/password and IP whitelist

### JWT errors
- ✅ Token might be expired - login again
- ✅ Verify JWT_SECRET matches in .env
- ✅ Check Authorization header format

## 📚 Documentation Files

- `IMPLEMENTATION_GUIDE.md` - Step-by-step development guide
- `TESTING_GUIDE.md` - Complete API testing instructions
- `FRONTEND_SETUP.md` - Frontend development guide

## 🔄 Development Workflow

1. **Start MongoDB**
2. **Start Backend** (`npm run dev` in backend folder)
3. **Start Frontend** (`npm start` in frontend folder)
4. **Test with Postman** (verify APIs work)
5. **Test in Browser** (verify UI works)

## 🚀 Deployment (Optional)

### Backend
- Deploy to Heroku, Railway, or Render
- Use MongoDB Atlas for production database

### Frontend
- Deploy to Netlify, Vercel, or GitHub Pages
- Update API URL to production backend URL

## 🤝 Contributing

This is a learning project. Feel free to:
- Add new features
- Improve UI/UX
- Fix bugs
- Enhance documentation

## 📄 License

This project is for educational purposes.

## 👨‍💻 Author

Software Engineer Trainer

## 🎓 Learning Resources

- **Node.js:** https://nodejs.org/docs
- **Express.js:** https://expressjs.com/
- **React:** https://react.dev/
- **MongoDB:** https://docs.mongodb.com/
- **Mongoose:** https://mongoosejs.com/docs/

## 💡 Tips for Beginners

1. **Take it slow** - Understand each piece before moving on
2. **Use console.log()** - Debug by logging values
3. **Read error messages** - They tell you exactly what's wrong
4. **Test frequently** - Test after each small change
5. **Google is your friend** - Search for error messages
6. **Don't give up** - Every error is a learning opportunity!

## 📞 Support

If you're stuck:
1. Check the documentation files
2. Review error messages carefully
3. Search on Stack Overflow
4. Test with Postman to isolate frontend vs backend issues

---

**Happy Coding! 🚀**

