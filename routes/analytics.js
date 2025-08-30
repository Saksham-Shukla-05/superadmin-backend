const express = require("express");
const { requireSuperadmin } = require("../middlewares/auth");
const { getAnalyticsSummary } = require("../controllers/analyticsController");

const router = express.Router();

router.get("/summary", requireSuperadmin, getAnalyticsSummary);

module.exports = router;
