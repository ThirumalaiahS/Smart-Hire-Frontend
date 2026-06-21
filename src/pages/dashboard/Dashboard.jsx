import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import client from "../../api/client";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area 
} from "recharts";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fallback mock stats for visual excellence if API is offline or not configured yet
  const mockStats = {
    Candidate: {
      appliedJobs: 5,
      interviews: 2,
      savedJobs: 12,
      recentApplications: [
        { id: 1, title: "Frontend Developer", company: "TechCorp", date: "2026-06-18", status: "Interviewing" },
        { id: 2, title: "React Engineer", company: "Innovate Inc", date: "2026-06-15", status: "Pending" },
        { id: 3, title: "UI Developer", company: "DesignSoft", date: "2026-06-10", status: "Offered" },
      ],
      chartData: [
        { name: "Jan", applications: 1 },
        { name: "Feb", applications: 3 },
        { name: "Mar", applications: 2 },
        { name: "Apr", applications: 5 },
        { name: "May", applications: 4 },
        { name: "Jun", applications: 6 },
      ]
    },
    Employer: {
      postedJobs: 8,
      totalCandidates: 45,
      hiredCount: 4,
      recentApplicants: [
        { id: 1, name: "Arun Kumar", role: "React Developer", appliedDate: "2026-06-20", matchScore: 92 },
        { id: 2, name: "Priya Sharma", role: "Fullstack Dev", appliedDate: "2026-06-19", matchScore: 85 },
        { id: 3, name: "Deepak Raj", role: "UI Designer", appliedDate: "2026-06-18", matchScore: 78 },
      ],
      chartData: [
        { name: "Week 1", views: 240, applications: 12 },
        { name: "Week 2", views: 320, applications: 18 },
        { name: "Week 3", views: 450, applications: 29 },
        { name: "Week 4", views: 560, applications: 45 },
      ]
    },
    Admin: {
      totalUsers: 154,
      activeUsers: 142,
      totalSystemApplications: 312,
      userRegistrations: [
        { month: "Jan", users: 20 },
        { month: "Feb", users: 35 },
        { month: "Mar", users: 60 },
        { month: "Apr", users: 95 },
        { month: "May", users: 120 },
        { month: "Jun", users: 154 },
      ]
    }
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Attempt to fetch live data from /api/dashboard/stats or similar if configured
        const response = await client.get("/api/dashboard/stats");
        setStats(response.data);
      } catch (err) {
        // Fallback gracefully to mock data based on role
        setStats(mockStats[user?.role || "Candidate"]);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center py-24">
        <div className="text-center space-y-4">
          <svg className="animate-spin h-10 w-10 text-teal-600 mx-auto" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-sm font-semibold text-slate-500">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto py-8 px-6 md:px-8">
      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6 mb-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-2.5 py-1 rounded-full">
            {user?.role} Workspace
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-2">
            Hello, {user?.name || "User"}
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Here's what is happening with your hiring pipeline today.
          </p>
        </div>
        <div className="flex gap-3">
          {user?.role === "Admin" && (
            <button
              onClick={() => navigate("/admin/users")}
              className="bg-slate-900 text-white font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-slate-800 transition-colors shadow-sm"
            >
              Manage Users
            </button>
          )}
          {user?.role === "Employer" && (
            <button
              onClick={() => navigate("/post-job")}
              className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-md transition-all active:scale-[0.98]"
            >
              Post a New Job
            </button>
          )}
          <button
            onClick={logout}
            className="border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-sm px-5 py-2.5 rounded-xl transition-all"
          >
            Logout
          </button>
        </div>
      </div>

      {/* CANDIDATE DASHBOARD */}
      {user?.role === "Candidate" && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Applied Applications</span>
              <p className="text-4xl font-extrabold text-slate-900 mt-2">{stats?.appliedJobs}</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Interviews Scheduled</span>
              <p className="text-4xl font-extrabold text-teal-600 mt-2">{stats?.interviews}</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Saved Positions</span>
              <p className="text-4xl font-extrabold text-slate-900 mt-2">{stats?.savedJobs}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-4">Application History Trend</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats?.chartData}>
                    <defs>
                      <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0d9488" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#0d9488" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                    <YAxis stroke="#94a3b8" fontSize={12} />
                    <Tooltip />
                    <Area type="monotone" dataKey="applications" stroke="#0d9488" strokeWidth={2} fillOpacity={1} fill="url(#colorApps)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-4">Recent Applications</h3>
              <div className="space-y-4">
                {stats?.recentApplications.map((app) => (
                  <div key={app.id} className="flex justify-between items-center p-3.5 bg-slate-50 rounded-xl">
                    <div>
                      <h4 className="font-bold text-sm text-slate-800">{app.title}</h4>
                      <p className="text-xs text-slate-500">{app.company} • {app.date}</p>
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      app.status === "Offered" 
                        ? "bg-emerald-50 text-emerald-700" 
                        : app.status === "Interviewing"
                        ? "bg-sky-50 text-sky-700"
                        : "bg-amber-50 text-amber-700"
                    }`}>
                      {app.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EMPLOYER DASHBOARD */}
      {user?.role === "Employer" && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Posted Positions</span>
              <p className="text-4xl font-extrabold text-slate-900 mt-2">{stats?.postedJobs}</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Applicants</span>
              <p className="text-4xl font-extrabold text-teal-600 mt-2">{stats?.totalCandidates}</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Hired Onboard</span>
              <p className="text-4xl font-extrabold text-emerald-600 mt-2">{stats?.hiredCount}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-4">Recruitment Funnel & Engagement</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats?.chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                    <YAxis stroke="#94a3b8" fontSize={12} />
                    <Tooltip />
                    <Bar dataKey="views" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="applications" fill="#0d9488" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-4">Top Applicants</h3>
              <div className="space-y-4">
                {stats?.recentApplicants.map((applicant) => (
                  <div key={applicant.id} className="flex justify-between items-center p-3.5 border border-slate-100 rounded-xl hover:shadow-sm transition-all">
                    <div>
                      <h4 className="font-bold text-sm text-slate-800">{applicant.name}</h4>
                      <p className="text-xs text-slate-500">{applicant.role} • {applicant.appliedDate}</p>
                    </div>
                    <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg">
                      {applicant.matchScore}% Match
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADMIN DASHBOARD */}
      {user?.role === "Admin" && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Registered Accounts</span>
              <p className="text-4xl font-extrabold text-slate-900 mt-2">{stats?.totalUsers}</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Users</span>
              <p className="text-4xl font-extrabold text-teal-600 mt-2">{stats?.activeUsers}</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Global Applications</span>
              <p className="text-4xl font-extrabold text-emerald-600 mt-2">{stats?.totalSystemApplications}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4">Monthly User Onboarding Growth</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats?.userRegistrations}>
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0d9488" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#0d9488" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip />
                  <Area type="monotone" dataKey="users" stroke="#0d9488" strokeWidth={2} fillOpacity={1} fill="url(#colorUsers)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
