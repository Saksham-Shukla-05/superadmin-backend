require("dotenv").config();
const express = require("express");
const { requireSuperadmin } = require("./middlewares/auth");

const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const roleRoutes = require("./routes/roles");
const auditLogRoutes = require("./routes/auditLogs");
const analyticsRoutes = require("./routes/analytics");
const cors = require("cors");
const app = express();
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

app.use(express.json());
app.use(
  cors({
    origin: ["https://superadmin-frontend.vercel.app"],
    credentials: true,
  })
);
// Routes

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "SuperAdmin API",
      version: "1.0.0",
      description: "API documentation for SuperAdmin backend",
    },
    servers: [
      {
        url: "http://localhost:5000/api/v1/superadmin/",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/superadmin/users", userRoutes);
app.use("/api/v1/superadmin/roles", roleRoutes);
app.use("/api/v1/superadmin/audit-logs", auditLogRoutes);
app.use("/api/v1/superadmin/analytics", analyticsRoutes);

app.get("/", (req, res) => {
  res.send("SuperAdmin API Running 🚀");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
