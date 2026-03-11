require('dotenv').config();
const express = require('express');
const symptomRoutes = require('./routes/symptomRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for parsing JSON bodies from incoming requests
app.use(express.json());

// Main API routes
app.use('/api/symptoms', symptomRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
