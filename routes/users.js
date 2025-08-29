const express = require("express");
const { requireSuperadmin } = require("../middlewares/auth");
const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/usersController");

const router = express.Router();

router.get("/", requireSuperadmin, getUsers);
router.get("/:id", requireSuperadmin, getUserById);
router.post("/", requireSuperadmin, createUser);
router.put("/:id", requireSuperadmin, updateUser);
router.delete("/:id", requireSuperadmin, deleteUser);

module.exports = router;
