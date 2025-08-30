const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function getAnalyticsSummary(req, res) {
  try {
    // Total users
    const totalUsers = await prisma.user.count();

    // Roles count
    const rolesCount = await prisma.role.count();

    // Active users (logins in last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const activeUsers = await prisma.auditLog.count({
      where: {
        action: "LOGIN", // assuming audit log stores "LOGIN" actions
        createdAt: { gte: sevenDaysAgo },
      },
    });

    res.json({
      success: true,
      data: {
        totalUsers,
        activeUsers,
        rolesCount,
      },
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch analytics",
      error: error.message,
    });
  }
}

module.exports = { getAnalyticsSummary };
