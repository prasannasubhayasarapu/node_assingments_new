const express = require('express');
const userRoutes = require('./routes/users.routes.js');
const todoRoutes = require('./routes/todos.routes.js');

const app = express();
app.use(express.json());

app.use('/users', userRoutes);
app.use('/todos', todoRoutes);

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});