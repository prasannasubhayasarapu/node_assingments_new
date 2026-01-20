const express = require('express');
const fs = require('fs');
const path = require('path');
const cloudinary = require('../config/cloudinary.config');
const { upload, requireProfileImage } = require('../middleware/upload.middleware');
const uniqueEmailMiddleware = require('../middleware/uniqueEmail.middleware');

const router = express.Router();
const dbPath = path.join(__dirname, '..', 'db.json');

// Helper functions
const readDB = () => JSON.parse(fs.readFileSync(dbPath, 'utf8'));
const writeDB = (data) => fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));

// POST /users/signup
router.post(
  '/signup',
  upload.single('profile'), // field name must be 'profile'
  requireProfileImage,
  uniqueEmailMiddleware,
  async (req, res) => {
    try {
      const { name, email, password } = req.body;

      // Validate required fields
      if (!name || !password) {
        return res.status(400).json({
          error: 'Name and password are required'
        });
      }

      // Upload image to Cloudinary
      const result = await cloudinary.uploader.upload_stream(
        { resource_type: 'image' },
        (error, cloudResult) => {
          if (error) throw new Error('Cloudinary upload failed');
        }
      ).end(req.file.buffer);

      // Generate user ID
      const db = readDB();
      const newId = db.users.length > 0 
        ? Math.max(...db.users.map(u => u.id)) + 1 
        : 1;

      const newUser = {
        id: newId,
        name: name.trim(),
        email: email.trim(),
        password: password, // ⚠️ In real apps, hash this!
        profilePic: result.secure_url
      };

      db.users.push(newUser);
      writeDB(db);

      // Return success response (without password)
      const { password: _, ...userResponse } = newUser;
      res.status(201).json({
        message: 'User registered successfully',
        user: userResponse
      });

    } catch (error) {
      console.error('Signup error:', error.message);
      res.status(500).json({
        error: 'Failed to register user'
      });
    }
  }
);

module.exports = router;