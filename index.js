require("dotenv").config();
const express = require("express");
const { requireSuperadmin } = require("./middlewares/auth");

const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const roleRoutes = require("./routes/roles");
const auditLogRoutes = require("./routes/auditLogs");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/superadmin/users", userRoutes);
app.use("/api/v1/superadmin/roles", roleRoutes);
app.use("/api/v1/superadmin/audit-logs", auditLogRoutes);

app.get("/", (req, res) => {
  res.send("SuperAdmin API Running 🚀");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
