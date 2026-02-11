// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// require('dotenv').config();

// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Test Route
// app.get('/', (req, res) => {
//   res.json({ message: 'Salon Booking API is running!' });
// });

// // Database Connection
// const connectDB = require('./config/db');
// connectDB();

// // Routes
// app.use('/api/auth', require('./routes/auth'));
// app.use('/api/users', require('./routes/users'));
// app.use('/api/services', require('./routes/services'));
// app.use('/api/appointments', require('./routes/appointments'));
// app.use('/api/payments', require('./routes/payments'));
// app.use('/api/reports', require('./routes/reports'));

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`✅ Server is running on port ${PORT}`);
// });

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test Route
app.get('/', (req, res) => {
  res.json({ message: 'Salon Booking API is running!' });
});

// Database Connection
const connectDB = require('./config/db');
connectDB();

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/services', require('./routes/services'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/reports', require('./routes/reports'));

// ✅ Export for Vercel
module.exports = app;
