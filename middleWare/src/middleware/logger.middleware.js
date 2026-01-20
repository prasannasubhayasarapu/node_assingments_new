const loggerMiddleware = (req, res, next) => {
  const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
};

module.exports = loggerMiddleware;