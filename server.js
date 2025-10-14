const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());


app.use('/api/v1/user', require('./routes/userRoutes')); // User routes
app.use('/api/v1/emp', require('./routes/employeeRoutes')); // Employee routes

app.get('/', (req, res) => {
  res.send('Server is running ');
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
