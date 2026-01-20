const rateLimitMap = new Map();

const rateLimiterMiddleware = (req, res, next) => {
  const clientIP = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = 15;

  if (!rateLimitMap.has(clientIP)) {
    rateLimitMap.set(clientIP, { count: 0, resetTime: now + windowMs });
  }

  const clientData = rateLimitMap.get(clientIP);

  if (now > clientData.resetTime) {
    // Reset window
    clientData.count = 0;
    clientData.resetTime = now + windowMs;
  }

  if (clientData.count >= maxRequests) {
    return res.status(429).json({
      error: "Too many requests, please try again later"
    });
  }

  clientData.count++;
  next();
};

module.exports = rateLimiterMiddleware;