const validateTodoMiddleware = (req, res, next) => {
  const allowedFields = ['title'];
  const bodyKeys = Object.keys(req.body);

  // Check if only 'title' is present
  if (bodyKeys.length !== 1 || !bodyKeys.includes('title')) {
    return res.status(400).json({
      error: "Invalid request body. Only 'title' is allowed"
    });
  }

  // Check if title is a non-empty string
  if (typeof req.body.title !== 'string' || req.body.title.trim() === '') {
    return res.status(400).json({
      error: "Invalid request body. 'title' must be a non-empty string"
    });
  }

  next();
};

module.exports = validateTodoMiddleware;