const { PrismaClient } = require("@prisma/client");
const { logAction } = require("../utils/auditLogger");
const prisma = new PrismaClient();

//  Get all roles
async function getRoles(req, res) {
  try {
    const roles = await prisma.role.findMany();
    res.json(roles);
  } catch (err) {
    console.error("Error fetching roles:", err);
    res.status(500).json({ error: "Failed to fetch roles" });
  }
}

//  Create new role
async function createRole(req, res) {
  try {
    const { name, permissions } = req.body;

    const role = await prisma.role.create({
      data: {
        name,
        permissions,
      },
    });

    res.status(201).json(role);
  } catch (err) {
    console.error("Error creating role:", err);
    res.status(500).json({ error: "Failed to create role" });
  }
}

//   Update existing role
async function updateRole(req, res) {
  try {
    const { name, permissions } = req.body;

    const data = {};
    if (name) data.name = name;
    if (permissions) data.permissions = permissions;

    const role = await prisma.role.update({
      where: { id: parseInt(req.params.id) },
      data,
    });

    res.json(role);
  } catch (err) {
    console.error("Error updating role:", err);
    res.status(500).json({ error: "Failed to update role" });
  }
}

//  Assign role to a user
async function assignRole(req, res) {
  try {
    const { userId, roleId } = req.body;

    console.log("********  at the assign role ******** ", userId, roleId);

    if (!roleId) {
      return res.status(400).json({ error: "roleId is required" });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    const role = await prisma.role.findUnique({ where: { id: roleId } });

    if (!user || !role) {
      return res.status(404).json({ error: "User or Role not found" });
    }

    // Check if already assigned
    const existing = await prisma.userRole.findFirst({
      where: {
        userId: userId,
        roleId: roleId,
      },
    });

    if (existing) {
      return res
        .status(400)
        .json({ error: "User already has this role assigned" });
    }

    // Assign role
    await prisma.userRole.create({
      data: { userId, roleId },
    });

    await logAction({
      action: "ASSIGN_ROLE",
      entity: "role",
      entityId: roleId,
      performedBy: req.user.id,
    });

    res.json({
      message: `Role '${role.name}' assigned to user '${user.email}'`,
    });
  } catch (err) {
    console.error("Error assigning role:", err);
    res.status(500).json({ error: "Failed to assign role" });
  }
}

module.exports = {
  getRoles,
  createRole,
  updateRole,
  assignRole,
};
