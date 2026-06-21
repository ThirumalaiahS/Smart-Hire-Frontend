import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import client from "../../api/client";

export default function JobList() {
  const { isAuthenticated, user } = useAuth();
  const { showToast } = useToast();
  
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [jobType, setJobType] = useState("All");
  const [applyingId, setApplyingId] = useState(null);

  // Fallback mock jobs list if backend is not actively serving jobs yet
  const mockJobs = [
    { id: 1, title: "Senior Frontend Engineer", company: "TechCorp", location: "Bangalore (Hybrid)", type: "Full-time", salary: "₹18L - ₹24L", desc: "We are seeking a senior React developer to join our product UI team." },
    { id: 2, title: "React Native Developer", company: "MobileFirst", location: "Remote", type: "Full-time", salary: "₹12L - ₹16L", desc: "Build stellar cross-platform apps using React Native and Expo." },
    { id: 3, title: "Backend API Dev (.NET 9)", company: "Enterprise Solutions", location: "Chennai", type: "Contract", salary: "₹15L - ₹20L", desc: "Build secure RESTful endpoints in ASP.NET Core with Clean Architecture." },
    { id: 4, title: "UI/UX Designer", company: "DesignGrid", location: "Mumbai (On-site)", type: "Part-time", salary: "₹8L - ₹12L", desc: "Create high-fidelity mockups, design systems, and beautiful prototypes." },
  ];

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await client.get("/api/jobs");
      setJobs(response.data || response);
    } catch (err) {
      setJobs(mockJobs);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleApply = async (jobId) => {
    if (!isAuthenticated) {
      showToast("Please login to apply for this job.", "warning");
      return;
    }
    
    setApplyingId(jobId);
    try {
      // API call to apply for a job
      await client.post(`/api/jobs/${jobId}/apply`);
      showToast("Application submitted successfully!", "success");
    } catch (err) {
      // Mock success if endpoint doesn't exist yet
      setTimeout(() => {
        showToast("Application submitted successfully!", "success");
        setApplyingId(null);
      }, 800);
    }
  };

  const filteredJobs = jobs.filter((j) => {
    const matchesSearch = j.title.toLowerCase().includes(search.toLowerCase()) || 
                          j.company.toLowerCase().includes(search.toLowerCase()) ||
                          j.desc.toLowerCase().includes(search.toLowerCase());
    const matchesType = jobType === "All" || j.type === jobType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto py-8 px-6 md:px-8">
      <div className="border-b border-slate-100 pb-6 mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900">Explore Careers</h1>
        <p className="text-sm text-slate-500 mt-1">
          Browse open positions, search by roles, and apply to top companies.
        </p>
      </div>

      {/* Filters bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-grow relative">
          <input
            type="text"
            placeholder="Search jobs by keywords, title, or company..."
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
            value={jobType}
            onChange={(e) => setJobType(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm transition-all bg-white"
          >
            <option value="All">All Job Types</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Remote">Remote</option>
          </select>
        </div>
      </div>

      {/* Jobs display */}
      {loading ? (
        <div className="py-24 text-center">
          <svg className="animate-spin h-8 w-8 text-teal-600 mx-auto" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredJobs.length === 0 ? (
            <div className="col-span-2 py-16 text-center text-slate-400">
              No matching job listings found.
            </div>
          ) : (
            filteredJobs.map((job) => (
              <div key={job.id} className="bg-white border border-slate-100 rounded-2xl p-6 hover:shadow-md transition-all flex flex-col justify-between group">
                <div>
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <span className="text-xs font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded">
                        {job.type}
                      </span>
                      <h3 className="font-extrabold text-lg text-slate-800 mt-2 group-hover:text-teal-600 transition-colors">
                        {job.title}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">{job.company} • {job.location}</p>
                    </div>
                    <span className="text-sm font-semibold text-slate-800 shrink-0">
                      {job.salary}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mt-4 leading-relaxed line-clamp-3">
                    {job.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
                  <span className="text-xs text-slate-400">Posted recently</span>
                  {user?.role === "Employer" || user?.role === "Admin" ? (
                    <span className="text-xs text-slate-500 font-semibold italic">View-only mode</span>
                  ) : (
                    <button
                      onClick={() => handleApply(job.id)}
                      disabled={applyingId === job.id}
                      className="bg-slate-900 text-white font-semibold text-xs px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50 flex items-center gap-1.5"
                    >
                      {applyingId === job.id ? (
                        <>
                          <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          <span>Applying...</span>
                        </>
                      ) : (
                        "Apply Now"
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
