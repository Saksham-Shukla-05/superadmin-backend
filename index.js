require("dotenv").config();
const express = require("express");
const { requireSuperadmin } = require("./middlewares/auth");

const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");

const app = express();
app.use(express.json());

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/superadmin/users", userRoutes);

app.get("/", (req, res) => {
  res.send("SuperAdmin API Running 🚀");
});

// Example protected route
app.get("/api/v1/superadmin/secret", requireSuperadmin, (req, res) => {
  res.json({ message: "You are a superadmin!", user: req.user });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
