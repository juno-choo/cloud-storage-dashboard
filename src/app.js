const express = require('express');
const path = require('path');
const fileRoutes = require('./routes/fileRoutes'); // Import our file routes

// Create Express app
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// API routes - Mount our file routes at /api/files
app.use('/api/files', fileRoutes);

// Basic status route
app.get('/api/status', (req, res) => {
  res.json({ status: 'Server is running' });
});

module.exports = app;