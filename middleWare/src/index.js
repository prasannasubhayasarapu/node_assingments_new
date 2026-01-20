const express = require('express');
const path = require('path');
const loggerMiddleware = require('./middleware/logger.middleware');
const todosRouter = require('./routes/todos.routes');

const app = express();
const PORT = 3000;

// Built-in middleware
app.use(express.json());

// App-level logging middleware
app.use(loggerMiddleware);

// Routes
app.use('/todos', todosRouter);

// Handle 404 for non-todo routes
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});