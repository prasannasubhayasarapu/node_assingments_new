// src/routes/todos.routes.js
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'db.json');

const readDB = () => JSON.parse(fs.readFileSync(dbPath, 'utf8'));
const writeDB = (data) => fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));

// POST /todos/add
router.post('/add', (req, res) => {
  const db = readDB();
  const newTodo = { id: Date.now().toString(), ...req.body };
  db.todos.push(newTodo);
  writeDB(db);
  res.status(201).json(newTodo);
});

// GET /todos
router.get('/', (req, res) => {
  const db = readDB();
  res.json(db.todos);
});

// GET /todos/:todoId
router.get('/:todoId', (req, res) => {
  const db = readDB();
  const todo = db.todos.find(t => t.id === req.params.todoId);
  if (!todo) return res.status(404).json({ error: 'Todo not found' });
  res.json(todo);
});

// PUT /todos/update/:todoId
router.put('/update/:todoId', (req, res) => {
  const db = readDB();
  const index = db.todos.findIndex(t => t.id === req.params.todoId);
  if (index === -1) return res.status(404).json({ error: 'Todo not found' });

  db.todos[index] = { ...db.todos[index], ...req.body, id: req.params.todoId };
  writeDB(db);
  res.json(db.todos[index]);
});

// DELETE /todos/delete/:todoId
router.delete('/delete/:todoId', (req, res) => {
  const db = readDB();
  const initialLength = db.todos.length;
  db.todos = db.todos.filter(t => t.id !== req.params.todoId);

  if (db.todos.length === initialLength) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  writeDB(db);
  res.status(204).send();
});

module.exports = router;