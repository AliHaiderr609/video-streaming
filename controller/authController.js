const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const SECRET = "supersecretkey";

// Sign Up
exports.signup = async (req, res) => {
    const { username, password, email, role } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: "Email is already registered" });
    }
    try {
        const user = await User.create({ username, password: hash, email, role });
        res.status(201).json(user);
    } catch (err) {
        res.status(400).send("User already exists");
    }
};

// Log In
exports.login = async (req, res) => {
    const {  email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(400).send("Invalid credentials");
    }

    const token = jwt.sign({ id: user.id, role: user.role }, SECRET);
    res.json({ token, user });
};

exports.getProfile = async (req, res) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(400).json({ message: "Invalid request: User ID is missing." });
      }
      const user = await User.findById(req.user.id).select("-password");
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }
      res.status(200).json(user);

    } catch (error) {
      res.status(500).json({ message: "An unexpected error occurred. Please try again later." });
    }
  };
  
  
  exports.updateProfile = async (req, res) => {
    try {
      const { username, email, password, avatarUrl, bio, location } = req.body;
  
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Update the user's profile fields if provided
      if (username) user.username = username.trim();
      if (email) user.email = email.trim();
      if (password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
      }
  
      if (req.file && req.file.filename) {
        user.avatarUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
      }
      if (bio) user.bio = bio.trim();
      if (location) user.location = location.trim();
      await user.save();
  
      res.status(200).json({
        message: "Profile updated successfully",
        user: {
          id: user._id,
          username: user?.username,
          email: user?.email,
          avatarUrl: `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`,
          bio: user?.bio,
          location: user?.location,
          role: user?.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      });
    } catch (error) {
      res.status(500).json({ message: "An error occurred while updating the profile. Please try again later." });
    }
  };
  