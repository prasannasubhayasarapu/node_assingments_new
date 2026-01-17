// src/routes/users.routes.js
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'db.json');

const readDB = () => JSON.parse(fs.readFileSync(dbPath, 'utf8'));
const writeDB = (data) => fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));

// POST /users/add
router.post('/add', (req, res) => {
  const db = readDB();
  const newUser = { id: Date.now().toString(), ...req.body }; // simple unique ID
  db.users.push(newUser);
  writeDB(db);
  res.status(201).json(newUser);
});

// GET /users
router.get('/', (req, res) => {
  const db = readDB();
  res.json(db.users);
});

// GET /users/:userId
router.get('/:userId', (req, res) => {
  const db = readDB();
  const user = db.users.find(u => u.id === req.params.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

// PUT /users/update/:userId
router.put('/update/:userId', (req, res) => {
  const db = readDB();
  const index = db.users.findIndex(u => u.id === req.params.userId);
  if (index === -1) return res.status(404).json({ error: 'User not found' });

  db.users[index] = { ...db.users[index], ...req.body, id: req.params.userId };
  writeDB(db);
  res.json(db.users[index]);
});

// DELETE /users/delete/:userId
router.delete('/delete/:userId', (req, res) => {
  const db = readDB();
  const initialLength = db.users.length;
  db.users = db.users.filter(u => u.id !== req.params.userId);
  
  if (db.users.length === initialLength) {
    return res.status(404).json({ error: 'User not found' });
  }

  writeDB(db);
  res.status(204).send(); // No content
});

module.exports = router;