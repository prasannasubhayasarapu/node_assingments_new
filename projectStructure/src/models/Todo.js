// In-memory storage (replace with DB like MongoDB in real apps)
let todos = [];
let nextId = 1;

export const getAllTodos = () => todos;

export const getTodoById = (id) => todos.find(todo => todo.id === Number(id));

export const createTodo = (title) => {
  const newTodo = { id: nextId++, title, completed: false };
  todos.push(newTodo);
  return newTodo;
};

export const updateTodo = (id, updates) => {
  const todo = getTodoById(id);
  if (!todo) return null;
  Object.assign(todo, updates);
  return todo;
};

export const deleteTodo = (id) => {
  const index = todos.findIndex(todo => todo.id === Number(id));
  if (index === -1) return false;
  todos.splice(index, 1);
  return true;
};