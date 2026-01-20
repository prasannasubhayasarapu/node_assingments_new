import express from 'express';
import todoRoutes from './routes/todoRoutes.js';

const app = express();

app.use(express.json());

// Basic route
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Todo API is running!' });
});

// Todo routes
app.use('/api/todos', todoRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

export default app;