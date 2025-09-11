require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const enquiryRoutes = require("./routes/enquiry");

const authRoutes = require('./routes/auth');
const commentRoutes = require('./routes/comment');

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/enquiry", enquiryRoutes);

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/discussinBoard')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use('/api/auth', authRoutes);
app.use('/api/comments', commentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));