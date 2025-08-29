const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");
const { logAction } = require("../utils/auditLogger");
const prisma = new PrismaClient();

//  GET all users
async function getUsers(req, res) {
  try {
    const users = await prisma.user.findMany({
      include: { roles: { include: { role: true } } },
    });
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
}

//  GET user by ID
async function getUserById(req, res) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { roles: { include: { role: true } } },
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ error: "Failed to fetch user" });
  }
}

//  CREATE user
async function createUser(req, res) {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    await logAction({
      action: "CREATE_USER",
      entity: "user",
      entityId: newUser.id,
      performedBy: req.user.id,
    });

    res.status(201).json(newUser);
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({ error: "Failed to create user" });
  }
}
//  UPDATE user
async function updateUser(req, res) {
  try {
    const { name, email, password } = req.body;
    const data = {};
    if (name) data.name = name;
    if (email) data.email = email;
    if (password) data.password = await bcrypt.hash(password, 10);

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(req.params.id) },
      data,
    });

    await logAction({
      action: "UPDATE_USER",
      entity: "user",
      entityId: updatedUser.id,
      performedBy: req.user.id,
    });

    res.json(updatedUser);
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ error: "Failed to update user" });
  }
}

//  DELETE user
async function deleteUser(req, res) {
  try {
    const deletedUser = await prisma.user.delete({
      where: { id: parseInt(req.params.id) },
    });

    await logAction({
      action: "DELETE_USER",
      entity: "user",
      entityId: deletedUser.id,
      performedBy: req.user.id,
    });

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ error: "Failed to delete user" });
  }
}

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
