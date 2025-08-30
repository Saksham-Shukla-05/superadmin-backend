import { useEffect, useState } from "react";
import api from "../utils/axiosInstance";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [editingUser, setEditingUser] = useState(null);
  const [viewUser, setViewUser] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [currentUserForRole, setCurrentUserForRole] = useState(null);
  const [roles, setRoles] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 4;

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  async function fetchUsers() {
    try {
      const res = await api.get("/superadmin/users");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  }

  async function fetchRoles() {
    try {
      const res = await api.get("/superadmin/roles");
      setRoles(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleCreateUser(e) {
    e.preventDefault();
    try {
      if (editingUser) {
        await api.put(`/superadmin/users/${editingUser.id}`, form);
        setEditingUser(null);
      } else {
        await api.post("/superadmin/users", form);
      }
      setForm({ name: "", email: "", password: "" });
      setShowForm(false);
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert("Failed to save user");
    }
  }

  function handleEdit(user) {
    setEditingUser(user);
    setForm({ name: user.name, email: user.email, password: "" });
    setShowForm(true);
  }

  function resetForm() {
    setEditingUser(null);
    setForm({ name: "", email: "", password: "" });
    setShowForm(false);
  }

  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await api.delete(`/superadmin/users/${id}`);
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert("Failed to delete user");
    }
  }

  async function handleView(id) {
    try {
      const res = await api.get(`/superadmin/users/${id}`);
      setViewUser(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to view user");
    }
  }

  function openRoleModal(user) {
    setCurrentUserForRole(user);
    setSelectedRoles(user.roles.map((r) => r.role.id));
    setShowRoleModal(true);
  }

  async function handleAssignRoles() {
    if (!currentUserForRole) return;
    console.log("Assigning role:", currentUserForRole.id, selectedRoles[0]);

    try {
      await api.post("/superadmin/roles/assign-role", {
        userId: currentUserForRole.id,
        roleId: selectedRoles[0], // ✅ fixed key name
      });
      setShowRoleModal(false);
      setCurrentUserForRole(null);
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert("Failed to assign role");
    }
  }

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  if (loading) return <p>Loading users...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold mb-4">Users</h1>
        <button
          className="border-2 p-2 rounded-full"
          onClick={() => setShowForm(true)}
        >
          {editingUser ? "Edit User" : "Create User"}
        </button>
      </div>

      <input
        type="text"
        placeholder="Search by name or email..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border p-2 mb-4 w-1/2 rounded"
      />

      <table className="w-full border border-gray-300 bg-white shadow mb-4">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Roles</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((u) => (
            <tr key={u.id}>
              <td className="p-2 border">{u.id}</td>
              <td className="p-2 border">{u.name}</td>
              <td className="p-2 border">{u.email}</td>
              <td className="p-2 border">
                {u.roles.map((r) => r.role.name).join(", ") || "—"}
              </td>
              <td className="p-2 border">
                <button
                  onClick={() => handleEdit(u)}
                  className="bg-yellow-500 text-white px-2 py-1 mr-2 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(u.id)}
                  className="bg-red-600 text-white px-2 py-1 mr-2 rounded"
                >
                  Delete
                </button>
                <button
                  onClick={() => handleView(u.id)}
                  className="bg-green-600 text-white px-2 py-1 mr-2 rounded"
                >
                  View
                </button>
                <button
                  onClick={() => openRoleModal(u)}
                  className="bg-purple-600 text-white px-2 py-1 rounded"
                >
                  Assign Roles
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-center space-x-2 mb-4">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 border rounded ${
              currentPage === i + 1 ? "bg-blue-600 text-white" : ""
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* View User Modal */}
      {viewUser && viewUser.id && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={() => setViewUser({})}
          ></div>
          <div className="bg-white p-6 rounded-lg shadow-lg z-10 w-1/2 max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-2">
              {viewUser.name}'s Details
            </h2>
            <p>
              <strong>ID:</strong> {viewUser.id}
            </p>
            <p>
              <strong>Name:</strong> {viewUser.name}
            </p>
            <p>
              <strong>Email:</strong> {viewUser.email}
            </p>
            <p>
              <strong>Created At:</strong>{" "}
              {new Date(viewUser.createdAt).toLocaleString()}
            </p>
            <p>
              <strong>Updated At:</strong>{" "}
              {new Date(viewUser.updatedAt).toLocaleString()}
            </p>
            <p>
              <strong>Last Login:</strong>{" "}
              {viewUser.lastLogin
                ? new Date(viewUser.lastLogin).toLocaleString()
                : "Never logged in"}
            </p>
            <div className="mt-2">
              <strong>Roles & Permissions:</strong>
              <ul className="list-disc pl-6">
                {viewUser.roles.map((r) => (
                  <li key={r.id}>
                    <span className="font-medium">{r.role.name}</span>
                    <ul className="list-circle pl-6 text-sm text-gray-600">
                      {r.role.permissions.map((p, idx) => (
                        <li key={idx}>{p}</li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>
            <button
              onClick={() => setViewUser({})}
              className="mt-4 bg-gray-400 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Create / Edit User Form */}
      {showForm && (
        <form
          onSubmit={handleCreateUser}
          className="p-4 bg-white shadow rounded w-1/2 mt-4"
        >
          <h2 className="text-xl font-bold mb-2">
            {editingUser ? "Update User" : "Create New User"}
          </h2>
          <input
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border p-2 mb-2"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full border p-2 mb-2"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full border p-2 mb-2"
            required={!editingUser}
          />
          <div className="flex items-center space-x-2">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              {editingUser ? "Update User" : "Create User"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Assign Roles Modal */}
      {showRoleModal && currentUserForRole && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={() => setShowRoleModal(false)}
          ></div>
          <div className="bg-white p-6 rounded-lg shadow-lg z-10 w-1/3 max-h-[70vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              Assign Roles to {currentUserForRole.name}
            </h2>
            <select
              multiple
              value={selectedRoles}
              onChange={(e) =>
                setSelectedRoles(
                  Array.from(e.target.selectedOptions, (option) =>
                    Number(option.value)
                  )
                )
              }
              className="w-full border p-2 mb-4"
            >
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleAssignRoles}
                className="bg-purple-600 text-white px-4 py-2 rounded"
              >
                Assign
              </button>
              <button
                onClick={() => setShowRoleModal(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
