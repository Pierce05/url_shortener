const { ZodError } = require("zod");

function errorHandler(error, _req, res, _next) {
  if (error instanceof ZodError) {
    return res.status(400).json({
      message: "Validation failed.",
      issues: error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  if (error?.code === 11000) {
    return res.status(409).json({
      message: "That short code is already in use.",
    });
  }

  return res.status(error.statusCode || 500).json({
    message: error.message || "Something went wrong.",
  });
}

module.exports = errorHandler;
