const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');

// Multer for video uploads
const storage = multer.diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// Authentication middleware
const SECRET = "supersecretkey";
const authenticate = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).send("Unauthorized");

    jwt.verify(token.split(" ")[1], SECRET, (err, user) => {
        if (err) return res.status(403).send("Invalid token");
        req.user = user;
        next();
    });
};

module.exports = { upload, authenticate };
