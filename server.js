require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const profileRoutes = require('./routes/profile');

const app = express();

// Connect to MongoDB
connectDB();

app.use(cors());
app.use(express.json());

// Mount route prefixes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/profile', profileRoutes);

// Optional: Add a simple root route
app.get('/', (req, res) => {
  res.send('✅ Backend is running on Vercel!');
});

// Don't call app.listen — instead, export the app
module.exports = app;
// This allows Vercel to handle the serverless function deployment
// and automatically set up the serverless environment
