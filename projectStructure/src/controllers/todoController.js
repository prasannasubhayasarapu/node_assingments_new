import * as TodoModel from '../models/Todo.js';

export const getTodos = (req, res) => {
  try {
    const todos = TodoModel.getAllTodos();
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getTodoById = (req, res) => {
  try {
    const { id } = req.params;
    const todo = TodoModel.getTodoById(id);
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    res.status(200).json(todo);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const createTodo = (req, res) => {
  try {
    const { title } = req.body;
    if (!title?.trim()) {
      return res.status(400).json({ message: 'Title is required' });
    }
    const newTodo = TodoModel.createTodo(title.trim());
    res.status(201).json(newTodo);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateTodo = (req, res) => {
  try {
    const { id } = req.params;
    const { title, completed } = req.body;

    if (!TodoModel.getTodoById(id)) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    const updates = {};
    if (title !== undefined) updates.title = title.trim();
    if (completed !== undefined) updates.completed = Boolean(completed);

    const updatedTodo = TodoModel.updateTodo(id, updates);
    res.status(200).json(updatedTodo);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteTodo = (req, res) => {
  try {
    const { id } = req.params;
    const deleted = TodoModel.deleteTodo(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    res.status(204).send(); // No content
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};