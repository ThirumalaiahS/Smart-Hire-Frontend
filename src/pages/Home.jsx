import logo from "../assets/Logo.png";

export default function Home() {
  return (
    <section className="min-h-[80vh] flex items-center py-16">
      <div className="max-w-7xl mx-auto px-6 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full">
        <div className="lg:col-span-7 space-y-6">
          <span className="text-xs font-bold uppercase tracking-widest text-teal-600 bg-teal-50 px-3.5 py-1.5 rounded-full border border-teal-100/50">
            Next Generation Recruitment
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-none">
            Hire Smart.<br />
            <span className="bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
              Build Your Future.
            </span>
          </h1>
          <p className="text-slate-500 text-base md:text-lg leading-relaxed max-w-xl">
            SmartHire bridges the gap between top-tier candidates and growing enterprises with an intuitive, human-centered matchmaking experience.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <a
              href="/jobs"
              className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-semibold px-7 py-3.5 rounded-xl shadow-lg shadow-teal-600/15 hover:shadow-teal-700/25 active:scale-95 transition-all duration-200"
            >
              Browse Jobs
            </a>
            <a
              href="/register?role=Employer"
              className="border border-slate-200 text-slate-700 font-semibold px-7 py-3.5 rounded-xl hover:bg-slate-50 active:scale-95 transition-all duration-200"
            >
              Post a Position
            </a>
          </div>
        </div>

        <div className="lg:col-span-5 flex justify-center lg:justify-end">
          <div className="relative p-8 md:p-12 bg-white/40 border border-white/50 backdrop-blur-md rounded-3xl shadow-xl flex items-center justify-center max-w-sm w-full">
            <div className="absolute top-4 left-4 w-12 h-12 bg-teal-100 rounded-full blur-xl opacity-50" />
            <div className="absolute bottom-4 right-4 w-16 h-16 bg-emerald-100 rounded-full blur-xl opacity-50" />
            <img 
              src={logo} 
              alt="SmartHire" 
              className="w-full h-auto object-contain z-10 transition-transform duration-500 hover:scale-105" 
            />
          </div>
        </div>
      </div>
    </section>
  );
}
