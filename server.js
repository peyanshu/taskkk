const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { requestLogger, errorHandler, notFoundHandler } = require('./middleware/middleware');
const authRoutes = require('./routes/auth');
const bookRoutes = require('./routes/books');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(requestLogger);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ message: 'Book Management API is running!', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;