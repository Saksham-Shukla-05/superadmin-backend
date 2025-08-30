import { useEffect, useState } from "react";
import api from "../utils/axiosInstance";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [editingUser, setEditingUser] = useState(null);
  const [viewUser, setViewUser] = useState([]);
  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const res = await api.get("/superadmin/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  }

  // create new user
  async function handleCreateUser(e) {
    e.preventDefault();
    try {
      if (editingUser) {
        // update existing user
        await api.put(`/superadmin/users/${editingUser.id}`, form);
        setEditingUser(null);
      } else {
        // create new user
        await api.post("/superadmin/users", form);
      }

      setForm({ name: "", email: "", password: "" });
      fetchUsers(); // refresh list
    } catch (err) {
      console.error("Error saving user:", err);
      alert("Failed to save user");
    }
  }

  function handleEdit(user) {
    setEditingUser(user);
    setForm({ name: user.name, email: user.email, password: "" });
  }

  // delete user
  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await api.delete(`/superadmin/users/${id}`);
      fetchUsers();
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("Failed to delete user");
    }
  }

  async function handleView(id) {
    try {
      const res = await api.get(`/superadmin/users/${id}`);
      setViewUser(res.data);
    } catch (err) {
      console.error("Error viewing user:", err);
      alert("Failed to view user");
    }
  }
  if (loading) return <p>Loading users...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Users </h1>

      <table className="w-full border border-gray-300 bg-white shadow mb-6">
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
          {users.map((u) => (
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
                  className="bg-green-600 text-white px-2 py-1 rounded"
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {viewUser && viewUser.id && (
        <div className="mt-6 p-4 border rounded bg-gray-100 shadow w-1/2">
          <h2 className="text-xl font-bold mb-2">User Details</h2>
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
            className="mt-3 bg-gray-400 text-white px-4 py-2 rounded"
          >
            Close
          </button>
        </div>
      )}

      <form
        onSubmit={handleCreateUser}
        className="p-4 bg-white shadow rounded w-1/2"
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
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {editingUser ? "Update User" : "Create User"}
        </button>
        {editingUser && (
          <button
            type="button"
            onClick={() => {
              setEditingUser(null);
              setForm({ name: "", email: "", password: "" });
            }}
            className="ml-2 bg-gray-400 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        )}
      </form>
    </div>
  );
}
