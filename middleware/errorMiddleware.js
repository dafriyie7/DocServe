const errorHandler = (err, req, res, next) => {
  // Log the error for debugging purposes
  console.error(err.stack);

  // Check if headers have already been sent to prevent headers sent errors
  if (res.headersSent) {
    return next(err);
  }

  // Handle specific types of errors
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Handle other types of errors
  res.status(500).json({ error: 'Internal Server Error' });
};

module.exports = errorHandler;