import React, { useEffect, useState } from "react";
import api from "../utils/axiosInstance";
export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [action, setAction] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  // Fetch logs
  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await api.get("/superadmin/audit-logs", {
        params: {
          action: action || undefined,
          date: date || undefined,
        },
      });
      setLogs(res.data);
    } catch (err) {
      console.error("Error fetching logs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [action, date]);

  const clearFilters = () => {
    setAction("");
    setDate("");
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Audit Logs</h2>

      {/* Filters */}
      <div className="flex gap-4 mb-4">
        {/* Action Filter */}
        <select
          value={action}
          onChange={(e) => setAction(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Actions</option>

          <option value="CREATE_USER">CREATE</option>
          <option value="UPDATE_USER">UPDATE</option>
          <option value="ASSIGN_ROLE">ASSIGN</option>
        </select>

        {/* Date Filter */}
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border p-2 rounded"
        />

        {/* Clear Button */}
        <button
          onClick={clearFilters}
          className="px-4 py-2 bg-gray-300 rounded"
        >
          Clear Filters
        </button>
      </div>

      {/* Logs Table */}
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">User</th>
            <th className="p-2 border">Action</th>
            <th className="p-2 border">Date</th>
          </tr>
        </thead>
        <tbody>
          {!loading ? (
            logs.map((log) => (
              <tr key={log.id} className="border">
                <td className="p-2 border">
                  {log.performedByUser?.name || "Unknown"}
                </td>
                <td className="p-2 border">{log.action}</td>
                <td className="p-2 border">
                  {new Date(log.createdAt).toLocaleString()}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="p-2 text-center">
                Loading
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
