require("dotenv").config();
const express = require("express");
const serverless = require("serverless-http");
const cors = require("cors");

const userRoutes = require("../routes/users");
const authRoutes = require("../routes/auth");
const roleRoutes = require("../routes/roles");
const auditLogRoutes = require("../routes/auditLogs");
const analyticsRoutes = require("../routes/analytics");

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: ["https://superadmin-frontend-ou6r.vercel.app"],
    credentials: true,
  })
);

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/superadmin/users", userRoutes);
app.use("/api/v1/superadmin/roles", roleRoutes);
app.use("/api/v1/superadmin/audit-logs", auditLogRoutes);
app.use("/api/v1/superadmin/analytics", analyticsRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("SuperAdmin API Running 🚀");
});

// Export as serverless function
module.exports = serverless(app);
