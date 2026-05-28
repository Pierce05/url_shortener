require("dotenv").config();

const path = require("path");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const connectDB = require("./config/db");
const urlRoutes = require("./routes/urlRoutes");
const redirectRoute = require("./routes/redirectRoute");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");

function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(morgan("dev"));
  app.use(express.static(path.join(__dirname, "public")));

  app.get("/api/health", (_req, res) => {
    res.status(200).json({
      status: "ok",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    });
  });

  app.use("/api/urls", urlRoutes);
  app.use("/", redirectRoute);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}

async function startServer() {
  const PORT = process.env.PORT || 5000;
  const app = createApp();
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on ${process.env.BASE_URL || `http://localhost:${PORT}`}`);
  });
}

if (require.main === module) {
  startServer();
}

module.exports = {
  createApp,
  startServer,
};
