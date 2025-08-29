const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function logAction({ action, entity, entityId, performedBy }) {
  try {
    await prisma.auditLog.create({
      data: { action, entity, entityId, performedBy },
    });
  } catch (err) {
    console.error("Error writing audit log:", err);
  }
}

module.exports = { logAction };
