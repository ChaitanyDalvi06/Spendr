const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Import routes
const authRoutes = require('./Routes/authRoutes');
const personalInfoRoutes = require('./Routes/personalInfoRoutes');
const stockRoutes = require('./Routes/stockRoutes');
const tradingRoutes = require('./Routes/tradingRoutes');
const budgetCategoryRoutes = require('./Routes/budgetCategoryRoutes');
const goalRoutes = require('./Routes/goalRoutes');

const app = express();

// CORS configuration
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
}));

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/personal-info', personalInfoRoutes);
app.use('/api/stocks', stockRoutes);
app.use('/api/trading', tradingRoutes);
app.use('/api/budget-categories', budgetCategoryRoutes);
app.use('/api/goals', goalRoutes);

// Direct stock price endpoint for frontend compatibility
app.use('/api', stockRoutes);

// Example route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB connected to database:', process.env.MONGO_URI))
.catch(err => console.log('MongoDB connection error:', err));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
