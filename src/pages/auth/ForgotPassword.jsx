import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const { forgotPassword } = useAuth();
  const { showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      showToast("Please enter your email.", "warning");
      return;
    }

    setLoading(true);
    try {
      await forgotPassword(email);
      setSent(true);
      showToast("Reset instructions sent to your email.", "success");
    } catch (err) {
      showToast(err.message || "Failed to submit request.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center py-16 px-6">
      <div className="max-w-md w-full bg-white/70 backdrop-blur-md rounded-2xl shadow-xl border border-slate-100 p-8 md:p-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Forgot Password
          </h2>
          <p className="text-slate-500 mt-2 text-sm">
            Enter your email to receive password reset instructions
          </p>
        </div>

        {sent ? (
          <div className="bg-teal-50/50 border border-teal-100 rounded-xl p-6 text-center space-y-4">
            <svg className="w-12 h-12 text-teal-600 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 19v-8.93a2 2 0 01.89-1.664l8-5.333a2 2 0 012.22 0l8 5.333A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
            </svg>
            <h3 className="font-bold text-slate-900">Check your inbox</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              We have sent a reset password link to <span className="font-semibold text-slate-800">{email}</span>. Please check your email to proceed.
            </p>
            <button
              onClick={() => setSent(false)}
              className="text-xs font-semibold text-teal-600 hover:text-teal-700 underline block mx-auto pt-2"
            >
              Enter a different email
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-sm"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-teal-600/10 hover:shadow-teal-700/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Submitting...</span>
                </>
              ) : (
                "Send Reset Link"
              )}
            </button>
          </form>
        )}

        <div className="text-center mt-8 text-sm text-slate-500">
          Back to{" "}
          <a
            href="/login"
            className="font-semibold text-teal-600 hover:text-teal-700 hover:underline"
          >
            Login
          </a>
        </div>
      </div>
    </div>
  );
}
