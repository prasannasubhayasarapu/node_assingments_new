const express = require('express');
const fs = require('fs');
const path = require('path');
const rateLimiterMiddleware = require('../middleware/rateLimiter.middleware');
const validateTodoMiddleware = require('../middleware/validateTodo.middleware');

const router = express.Router();
const dbPath = path.join(__dirname, '..', 'db.json');

// Helper to read/write db
const readDB = () => JSON.parse(fs.readFileSync(dbPath, 'utf8'));
const writeDB = (data) => fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));

// GET /todos — with rate limiting
router.get('/', rateLimiterMiddleware, (req, res) => {
  const db = readDB();
  res.status(200).json(db.todos);
});

// GET /todos/:todoId
router.get('/:todoId', (req, res) => {
  const db = readDB();
  const todoId = parseInt(req.params.todoId, 10);
  const todo = db.todos.find(t => t.id === todoId);

  if (!todo) {
    return res.status(404).json({ error: 'Todo not found' });
  }
  res.status(200).json(todo);
});

// POST /todos/add — with validation
router.post('/add', validateTodoMiddleware, (req, res) => {
  const db = readDB();
  const newTodo = {
    id: db.todos.length > 0 ? Math.max(...db.todos.map(t => t.id)) + 1 : 1,
    title: req.body.title.trim(),
    completed: false
  };
  db.todos.push(newTodo);
  writeDB(db);
  res.status(201).json(newTodo);
});

// PUT /todos/update/:todoId
router.put('/update/:todoId', (req, res) => {
  const db = readDB();
  const todoId = parseInt(req.params.todoId, 10);
  const todoIndex = db.todos.findIndex(t => t.id === todoId);

  if (todoIndex === -1) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  // Allow updating title or completed status
  if (req.body.title !== undefined) {
    if (typeof req.body.title !== 'string' || req.body.title.trim() === '') {
      return res.status(400).json({ error: "'title' must be a non-empty string" });
    }
    db.todos[todoIndex].title = req.body.title.trim();
  }
  if (req.body.completed !== undefined) {
    if (typeof req.body.completed !== 'boolean') {
      return res.status(400).json({ error: "'completed' must be a boolean" });
    }
    db.todos[todoIndex].completed = req.body.completed;
  }

  writeDB(db);
  res.status(200).json(db.todos[todoIndex]);
});

// DELETE /todos/delete/:todoId
router.delete('/delete/:todoId', (req, res) => {
  const db = readDB();
  const todoId = parseInt(req.params.todoId, 10);
  const initialLength = db.todos.length;
  db.todos = db.todos.filter(t => t.id !== todoId);

  if (db.todos.length === initialLength) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  writeDB(db);
  res.status(200).json({ message: 'Todo deleted successfully' });
});

module.exports = router;