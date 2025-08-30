import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();

  const links = [
    { path: "/dashboard/users", label: "Users" },
    { path: "/dashboard/roles", label: "Roles" },
    { path: "/dashboard/audit-logs", label: "Audit Logs" },
  ];

  return (
    <div className="w-64 h-min-screen bg-gray-800 text-white flex flex-col">
      <h2 className="text-xl font-bold p-4 border-b border-gray-700">
        SuperAdmin
      </h2>
      <nav className="flex-1">
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`block px-4 py-2 hover:bg-gray-700 ${
              location.pathname === link.path ? "bg-gray-700" : ""
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
