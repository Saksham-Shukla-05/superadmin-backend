const express = require("express");
const { requireSuperadmin } = require("../middlewares/auth");
const {
  getRoles,
  createRole,
  updateRole,
  assignRole,
} = require("../controllers/rolesController");

const router = express.Router();

router.get("/", requireSuperadmin, getRoles);
router.post("/", requireSuperadmin, createRole);
router.put("/:id", requireSuperadmin, updateRole);
router.post("/assign-role", requireSuperadmin, assignRole);

module.exports = router;
