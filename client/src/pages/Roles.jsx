import React, { useEffect, useState } from "react";
import api from "../utils/axiosInstance";

const Roles = () => {
  const [roles, setRoles] = useState([]);
  const [newRole, setNewRole] = useState("");
  const [editingRole, setEditingRole] = useState(null);
  const [editName, setEditName] = useState("");

  // Fetch roles
  const fetchRoles = async () => {
    try {
      const res = await api.get("/superadmin/roles/");

      setRoles(res.data);
    } catch (err) {
      console.error("Error fetching roles", err);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  // Add role
  const addRole = async (e) => {
    e.preventDefault();
    if (!newRole.trim()) return;

    try {
      await api.post("/superadmin/roles/", { name: newRole });
      setNewRole("");
      fetchRoles();
    } catch (err) {
      console.error("Error adding role", err);
    }
  };

  // Start editing
  const startEdit = (role) => {
    setEditingRole(role.id);
    setEditName(role.name);
  };

  // Update role
  const updateRole = async (id) => {
    try {
      await api.put(`/superadmin/roles/${id}`, { name: editName });
      setEditingRole(null);
      setEditName("");
      fetchRoles();
    } catch (err) {
      console.error("Error updating role", err);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Roles Management</h1>

      <form onSubmit={addRole} className="flex gap-2 mb-6">
        <input
          type="text"
          value={newRole}
          onChange={(e) => setNewRole(e.target.value)}
          placeholder="Enter role name"
          className="border p-2 rounded w-full"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </form>

      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Role ID</th>
            <th className="border p-2">Role Name</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role) => (
            <tr key={role.id}>
              <td className="border p-2">{role.id}</td>
              <td className="border p-2">
                {editingRole === role.id ? (
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="border p-1 rounded w-full"
                  />
                ) : (
                  role.name
                )}
              </td>
              <td className="border p-2">
                {editingRole === role.id ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateRole(role.id)}
                      className="bg-green-600 text-white px-3 py-1 rounded"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingRole(null)}
                      className="bg-gray-400 text-white px-3 py-1 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => startEdit(role)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                )}
              </td>
            </tr>
          ))}
          {roles.length === 0 && (
            <tr>
              <td colSpan="3" className="text-center p-4">
                No roles found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Roles;
