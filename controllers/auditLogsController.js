const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function getAuditLogs(req, res) {
  try {
    const { userId, action, date } = req.query;

    const filters = {};
    if (userId) filters.performedBy = parseInt(userId);
    if (action) filters.action = action;
    if (date) {
      const start = new Date(date);
      const end = new Date(date);
      end.setDate(end.getDate() + 1);
      filters.createdAt = {
        gte: start,
        lt: end,
      };
    }

    const logs = await prisma.auditLog.findMany({
      where: filters,
      include: {
        performedByUser: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(logs);
  } catch (err) {
    console.error("Error fetching audit logs:", err);
    res.status(500).json({ error: "Failed to fetch audit logs" });
  }
}

module.exports = { getAuditLogs };
