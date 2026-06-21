import { useState, useEffect } from "react";
import logo from "../../assets/Logo.png";
import { useAuth } from "../../context/AuthContext";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();

  // Add subtle scroll effect to header shadow/backdrop
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Jobs", href: "/jobs" },
  ];

  if (isAuthenticated) {
    navLinks.push({ label: "Dashboard", href: "/dashboard" });
    if (user?.role === "Admin") {
      navLinks.push({ label: "Manage Users", href: "/admin/users" });
    }
  }

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-white/85 backdrop-blur-md border-b border-slate-100 shadow-sm"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center py-4 px-6 md:px-8">
        {/* Logo and Brand */}
        <a href="/" className="flex items-center group">
          <img
            src={logo}
            alt="SmartHire Logo"
            className="h-9 md:h-30 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.02]"
          />
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-slate-600 hover:text-teal-600 transition-colors duration-200 relative py-1 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-teal-600 after:transition-all after:duration-200"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop Call to Actions */}
        <div className="hidden md:flex gap-4 items-center">
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200/50">
                👤 {user?.name} ({user?.role})
              </span>
              <button
                onClick={logout}
                className="text-sm font-semibold text-slate-700 hover:text-teal-600 transition-colors duration-200 px-3 py-2 cursor-pointer"
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <a
                href="/login"
                className="text-sm font-semibold text-slate-700 hover:text-teal-600 transition-colors duration-200 px-4 py-2"
              >
                Login
              </a>
              <a
                href="/register"
                className="text-sm font-semibold bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white px-5 py-2.5 rounded-lg shadow-md shadow-teal-600/10 hover:shadow-teal-700/20 active:scale-95 transition-all duration-200"
              >
                Get Started
              </a>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-none transition-colors"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          ) : (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu with transition */}
      {open && (
        <div className="md:hidden border-t border-slate-100 bg-white/95 backdrop-blur-md animate-in slide-in-from-top duration-200">
          <div className="px-6 py-6 space-y-4 font-medium">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="block text-slate-700 hover:text-teal-600 text-base py-1 transition-colors"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <hr className="border-slate-100 my-4" />
            <div className="flex flex-col gap-3">
              {isAuthenticated ? (
                <>
                  <div className="text-sm font-semibold text-slate-500 text-center pb-2">
                    Logged in as: {user?.name} ({user?.role})
                  </div>
                  <button
                    onClick={() => {
                      setOpen(false);
                      logout();
                    }}
                    className="w-full text-center bg-slate-900 text-white px-4 py-2.5 rounded-lg font-semibold shadow-md transition-all"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <a
                    href="/login"
                    className="w-full text-center border border-slate-200 text-slate-700 px-4 py-2.5 rounded-lg font-semibold hover:bg-slate-50 transition-colors"
                    onClick={() => setOpen(false)}
                  >
                    Login
                  </a>
                  <a
                    href="/register"
                    className="w-full text-center bg-gradient-to-r from-teal-600 to-emerald-600 text-white px-4 py-2.5 rounded-lg font-semibold shadow-md hover:from-teal-700 hover:to-emerald-700 transition-all"
                    onClick={() => setOpen(false)}
                  >
                    Get Started
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
