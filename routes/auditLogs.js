const express = require("express");
const { requireSuperadmin } = require("../middlewares/auth");
const { getAuditLogs } = require("../controllers/auditLogsController");

const router = express.Router();

router.get("/", requireSuperadmin, getAuditLogs);

module.exports = router;
