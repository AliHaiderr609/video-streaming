const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require("path");
const authRoutes = require('./routes/authRoutes');
const videoRoutes = require('./routes/videoRoutes');
const commentRoutes = require('./routes/commentRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
var corsOptions = {
    origin: "*",
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  };
app.use(cors(corsOptions));

// MongoDB Connection 
mongoose.connect('mongodb+srv://alih65993:jIu8RujuwFfuxX2V@cluster0.xg0il.mongodb.net/',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/comments', commentRoutes);

//Production
// Serve React build in production
app.use(express.static(path.join(__dirname, 'tiktok-clone')));
app.get('/*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'tiktok-clone', './build', 'index.html'));
});

// Catch-all route for unmatched requests
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});