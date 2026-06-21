import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import client from "../../api/client";

export default function ManageUsers() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("All");

  // Fallback mock users list for visual design if database is not active
  const mockUsersList = [
    { id: "u1", email: "admin@smarthire.com", name: "System Admin", role: "Admin", isActive: true },
    { id: "u2", email: "recruit@amazon.com", name: "Amazon HR", role: "Employer", isActive: true },
    { id: "u3", email: "sanjay@gmail.com", name: "Sanjay Kumar", role: "Candidate", isActive: true },
    { id: "u4", email: "alice.employer@gmail.com", name: "Alice Boss", role: "Employer", isActive: false },
    { id: "u5", email: "bob.dev@gmail.com", name: "Bob Jobseeker", role: "Candidate", isActive: true },
  ];

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // Attempt live fetch
      const response = await client.get("/api/auth/users");
      setUsers(response.data || response);
    } catch (err) {
      // Fallback
      setUsers(mockUsersList);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role !== "Admin") {
      showToast("Access Denied: Admin privileges required.", "error");
      navigate("/dashboard");
      return;
    }
    fetchUsers();
  }, [user, navigate]);

  const handleDeactivate = async (userId) => {
    try {
      await client.patch(`/api/auth/deactivate/${userId}`);
      showToast("Account deactivated successfully.", "success");
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, isActive: false } : u));
    } catch (err) {
      showToast(err.message || "Failed to deactivate account.", "error");
    }
  };

  const handleActivate = async (userId) => {
    try {
      await client.patch(`/api/auth/activate/${userId}`);
      showToast("Account activated successfully.", "success");
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, isActive: true } : u));
    } catch (err) {
      showToast(err.message || "Failed to activate account.", "error");
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to permanently delete this user?")) return;
    
    try {
      await client.delete(`/api/auth/delete/${userId}`);
      showToast("User deleted successfully.", "success");
      setUsers(prev => prev.filter(u => u.id !== userId));
    } catch (err) {
      showToast(err.message || "Failed to delete user.", "error");
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || 
                          u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = filterRole === "All" || u.role === filterRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto py-8 px-6 md:px-8">
      {/* Back to Dashboard */}
      <button 
        onClick={() => navigate("/dashboard")}
        className="flex items-center gap-1 text-slate-500 hover:text-slate-900 transition-colors text-sm font-semibold mb-6"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Dashboard
      </button>

      <div className="border-b border-slate-100 pb-6 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">User Accounts</h1>
          <p className="text-sm text-slate-500 mt-1">
            Activate, deactivate, or delete user authentication credentials in the database.
          </p>
        </div>
      </div>

      {/* Filters/Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm transition-all"
          />
          <svg className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <div className="w-full md:w-48">
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm transition-all bg-white"
          >
            <option value="All">All Roles</option>
            <option value="Admin">Admin</option>
            <option value="Employer">Employer</option>
            <option value="Candidate">Candidate</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      {loading ? (
        <div className="py-24 text-center">
          <svg className="animate-spin h-8 w-8 text-teal-600 mx-auto" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
      ) : (
        <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/75 border-b border-slate-100 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-4 px-6">User Detail</th>
                  <th className="py-4 px-6">Role</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="py-12 text-center text-slate-400">
                      No matching user records found.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/30 transition-colors">
                      <td className="py-4 px-6">
                        <div>
                          <div className="font-bold text-slate-800">{item.name || item.email.split("@")[0]}</div>
                          <div className="text-xs text-slate-400 mt-0.5">{item.email}</div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                          item.role === "Admin"
                            ? "bg-slate-100 text-slate-700 border border-slate-200"
                            : item.role === "Employer"
                            ? "bg-indigo-50 text-indigo-700"
                            : "bg-teal-50 text-teal-700"
                        }`}>
                          {item.role}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
                          item.isActive ? "text-emerald-600" : "text-rose-600"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${item.isActive ? "bg-emerald-500" : "bg-rose-500"}`} />
                          {item.isActive ? "Active" : "Deactivated"}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right space-x-2">
                        {item.isActive ? (
                          <button
                            onClick={() => handleDeactivate(item.id)}
                            className="text-xs font-semibold text-amber-600 hover:bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5 transition-colors"
                          >
                            Deactivate
                          </button>
                        ) : (
                          <button
                            onClick={() => handleActivate(item.id)}
                            className="text-xs font-semibold text-emerald-600 hover:bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-1.5 transition-colors"
                          >
                            Activate
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-lg px-3 py-1.5 transition-colors"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
