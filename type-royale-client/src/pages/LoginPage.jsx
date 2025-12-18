import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserPlus,
  LogIn,
  Mail,
  Lock,
  User,
  Loader2,
  AlertCircle,
  Crown,
  Swords,
  Shield,
  Sparkles,
  Castle,
  Flame,
} from "lucide-react";
import useAudio from "../hooks/useAudio";
import MusicControl from "../components/MusicControl";

const API_BASE_URL = "http://localhost:3000";

export default function LoginPage() {
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Audio Hook
  const { isMuted, toggleMute } = useAudio("battle", {
    volume: 0.2,
    loop: true,
    autoPlay: true,
    fadeIn: true,
    fadeInDuration: 2000,
  });

  // --- LOGIC HANDLERS ---
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError("Please fill in all fields");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Login failed");
      localStorage.setItem("typeRoyaleToken", data.data.token);
      localStorage.setItem("typeRoyaleUser", JSON.stringify(data.data.user));
      navigate("/lobby");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!username.trim() || !email.trim() || !password.trim()) {
      setError("Please fill in all fields");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Registration failed");
      localStorage.setItem("typeRoyaleToken", data.data.token);
      localStorage.setItem("typeRoyaleUser", JSON.stringify(data.data.user));
      navigate("/lobby");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden font-royal selection:bg-amber-500/30 selection:text-amber-200">
      {/* --- EPIC MEDIEVAL BACKGROUND --- */}
      <div className="fixed inset-0">
        {/* Base: Deep royal gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d0618] via-[#1a0a2e] to-[#0a0514]" />

        {/* Castle silhouette at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-black/80 to-transparent" />

        {/* Mystical fog/mist layer */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-purple-900/20 to-transparent animate-pulse" />

        {/* Large floating magical orbs */}
        <div className="absolute top-[10%] left-[5%] w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[120px] animate-float-slow" />
        <div className="absolute top-[30%] right-[5%] w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-[100px] animate-float-medium" />
        <div className="absolute bottom-[20%] left-[20%] w-[300px] h-[300px] bg-blue-600/10 rounded-full blur-[80px] animate-float-slow" />

        {/* Subtle grid pattern for mystical feel */}
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />

        {/* Animated stars/particles */}
        <div className="absolute top-[15%] left-[20%] w-1 h-1 bg-amber-300 rounded-full animate-twinkle shadow-[0_0_6px_rgba(251,191,36,0.9)]" />
        <div className="absolute top-[25%] right-[25%] w-1.5 h-1.5 bg-amber-200 rounded-full animate-twinkle-delayed shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
        <div className="absolute top-[10%] right-[40%] w-1 h-1 bg-purple-300 rounded-full animate-twinkle shadow-[0_0_6px_rgba(192,132,252,0.9)]" />
        <div className="absolute top-[35%] left-[35%] w-0.5 h-0.5 bg-white rounded-full animate-twinkle-delayed shadow-[0_0_4px_rgba(255,255,255,0.9)]" />
        <div className="absolute top-[8%] left-[60%] w-1 h-1 bg-amber-400 rounded-full animate-twinkle shadow-[0_0_6px_rgba(251,191,36,0.8)]" />
        <div className="absolute top-[20%] left-[75%] w-0.5 h-0.5 bg-purple-200 rounded-full animate-twinkle-delayed shadow-[0_0_4px_rgba(192,132,252,0.8)]" />
        <div className="absolute top-[45%] right-[15%] w-1 h-1 bg-amber-300 rounded-full animate-twinkle shadow-[0_0_5px_rgba(251,191,36,0.7)]" />
        <div className="absolute top-[5%] left-[45%] w-1.5 h-1.5 bg-white rounded-full animate-twinkle shadow-[0_0_8px_rgba(255,255,255,0.6)]" />

        {/* Diagonal light rays from top */}
        <div className="absolute top-0 left-1/4 w-1 h-[40vh] bg-gradient-to-b from-amber-500/10 to-transparent rotate-[15deg] blur-sm" />
        <div className="absolute top-0 right-1/3 w-0.5 h-[35vh] bg-gradient-to-b from-purple-400/10 to-transparent rotate-[-10deg] blur-sm" />

        {/* Vignette overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.7)_100%)]" />
      </div>

      {/* Music Control */}
      <div className="fixed top-6 right-6 z-50">
        <MusicControl
          isMuted={isMuted}
          onToggleMute={toggleMute}
          variant="lobby"
        />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4 md:p-6">
        <div className="max-w-md w-full perspective-[1000px]">
          {/* Logo Section */}
          <div className="text-center mb-8 transform hover:scale-105 transition-transform duration-500 cursor-default">
            <div className="relative inline-block mb-4">
              {/* Back Glow behind Crown */}
              <div className="absolute inset-0 bg-amber-500/30 rounded-full blur-2xl animate-pulse" />

              <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 p-5 rounded-full shadow-[0_0_30px_rgba(234,179,8,0.2)] border border-amber-500/20 ring-1 ring-amber-500/10">
                <Crown className="w-12 h-12 text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]" />
              </div>

              {/* Decorative Swords */}
              <Swords className="absolute -left-12 top-1/2 -translate-y-1/2 w-10 h-10 text-slate-700 -rotate-45 drop-shadow-lg opacity-50" />
              <Swords className="absolute -right-12 top-1/2 -translate-y-1/2 w-10 h-10 text-slate-700 rotate-45 scale-x-[-1] drop-shadow-lg opacity-50" />
            </div>

            <h1 className="font-royal text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-amber-400 to-amber-600 mb-3 text-glow-gold tracking-tight leading-none">
              TYPE ROYALE
            </h1>
            <div className="flex items-center justify-center gap-3 text-amber-300/60 text-xs md:text-sm font-royal font-semibold tracking-[0.25em] uppercase">
              <span className="w-10 h-[2px] bg-gradient-to-r from-transparent via-amber-500/50 to-amber-500/30"></span>
              <span className="flex items-center gap-2">
                <Flame className="w-3 h-3 text-orange-400 animate-pulse" />
                Battle with Words
                <Flame className="w-3 h-3 text-orange-400 animate-pulse" />
              </span>
              <span className="w-10 h-[2px] bg-gradient-to-l from-transparent via-amber-500/50 to-amber-500/30"></span>
            </div>
          </div>

          {/* Auth Card */}
          <div className="relative group">
            {/* Card Glow Border Effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-600/30 via-purple-600/30 to-amber-600/30 rounded-2xl blur opacity-60 group-hover:opacity-100 transition duration-1000 animate-pulse" />

            <div className="relative bg-[#0f0a1f]/80 backdrop-blur-xl p-8 rounded-2xl border border-white/5 shadow-2xl">
              {/* Ornate Corners (Enhanced) */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-amber-500/20 rounded-tl-lg" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-amber-500/20 rounded-tr-lg" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-amber-500/20 rounded-bl-lg" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-amber-500/20 rounded-br-lg" />

              {/* Tab Toggle */}
              <div className="flex mb-8 bg-black/50 rounded-xl p-1.5 border border-white/5 shadow-inner">
                {["login", "register"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => {
                      setMode(tab);
                      setError("");
                    }}
                    className={`flex-1 py-3 px-4 rounded-lg font-royal font-bold text-xs md:text-sm transition-all duration-300 flex items-center justify-center gap-2 uppercase tracking-widest ${
                      mode === tab
                        ? "bg-gradient-to-br from-purple-700 to-purple-900 text-amber-100 shadow-lg border border-purple-400/30 ring-1 ring-amber-400/10"
                        : "text-gray-500 hover:text-amber-200 hover:bg-white/5"
                    }`}
                  >
                    {tab === "login" ? (
                      <LogIn className="w-4 h-4" />
                    ) : (
                      <UserPlus className="w-4 h-4" />
                    )}
                    {tab}
                  </button>
                ))}
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 bg-red-950/50 border border-red-500/30 rounded-xl flex items-start gap-3 text-red-200 animate-[shake_0.5s_ease-in-out] backdrop-blur-sm">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <span className="text-xs font-royal font-semibold leading-relaxed tracking-wide">
                    {error}
                  </span>
                </div>
              )}

              {/* Login Form */}
              {mode === "login" && (
                <form onSubmit={handleLogin} className="space-y-5">
                  <InputField
                    label="Knight's Name"
                    icon={User}
                    value={username}
                    onChange={setUsername}
                    placeholder="Enter your name..."
                  />
                  <InputField
                    label="Secret Spell (Password)"
                    icon={Lock}
                    type="password"
                    value={password}
                    onChange={setPassword}
                    placeholder="Enter your password..."
                  />

                  <div className="pt-2">
                    <ActionButton
                      loading={loading}
                      text="Enter the Arena"
                      icon={Swords}
                    />
                  </div>
                </form>
              )}

              {/* Register Form */}
              {mode === "register" && (
                <form onSubmit={handleRegister} className="space-y-4">
                  <InputField
                    label="Knight's Name"
                    icon={User}
                    value={username}
                    onChange={setUsername}
                    placeholder="Choose a legendary name..."
                  />
                  <InputField
                    label="Raven's Address (Email)"
                    icon={Mail}
                    type="email"
                    value={email}
                    onChange={setEmail}
                    placeholder="your@email.com"
                  />
                  <InputField
                    label="Secret Spell (Password)"
                    icon={Lock}
                    type="password"
                    value={password}
                    onChange={setPassword}
                    placeholder="Create a powerful spell..."
                  />

                  <div className="pt-2">
                    <ActionButton
                      loading={loading}
                      text="Join the Kingdom"
                      icon={Shield}
                    />
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Footer Features */}
          <div className="mt-10 border-t border-amber-500/10 pt-6">
            <div className="grid grid-cols-4 gap-4">
              <FeatureIcon icon="⚡" label="Fast" />
              <FeatureIcon icon="🔥" label="Fierce" />
              <FeatureIcon icon="🛡️" label="Tactical" />
              <FeatureIcon icon="👑" label="Ranked" />
            </div>
            <div className="flex items-center justify-center gap-3 mt-6 text-amber-400/40">
              <Sparkles className="w-3 h-3" />
              <p className="text-[10px] tracking-[0.4em] font-royal font-bold uppercase">
                The Royal Arena v1.0
              </p>
              <Sparkles className="w-3 h-3" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- ENHANCED REUSABLE COMPONENTS ---

function InputField({
  label,
  icon: Icon,
  type = "text",
  value,
  onChange,
  placeholder,
}) {
  return (
    <div className="group/input">
      <label className="flex items-center gap-2 text-amber-300/60 mb-2 text-[10px] font-royal font-bold uppercase tracking-[0.15em] ml-1 group-focus-within/input:text-amber-400 transition-colors">
        {label}
      </label>
      <div className="relative transition-all duration-300 transform group-focus-within/input:scale-[1.02]">
        <div className="absolute inset-y-0 left-0 w-12 flex items-center justify-center bg-purple-900/30 rounded-l-xl border-r border-white/5">
          <Icon className="w-5 h-5 text-purple-300/60 group-focus-within/input:text-amber-400 transition-colors duration-300" />
        </div>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-14 pr-4 py-4 bg-black/50 border border-white/10 rounded-xl text-amber-50 placeholder-slate-500 focus:outline-none focus:border-amber-500/50 focus:bg-black/70 focus:ring-2 focus:ring-amber-500/20 transition-all font-royal font-medium text-sm tracking-wide"
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}

function ActionButton({ loading, text, icon: Icon }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="group relative w-full overflow-hidden rounded-xl p-[2px] focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-slate-900"
    >
      <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#fbbf24_0%,#92400e_25%,#7c3aed_50%,#92400e_75%,#fbbf24_100%)]" />
      <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-xl bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 px-8 py-4 text-sm font-royal font-bold text-white backdrop-blur-3xl transition-all group-hover:from-amber-500 group-hover:via-orange-500 group-hover:to-amber-600 group-hover:shadow-[0_0_30px_rgba(251,191,36,0.3)]">
        {loading ? (
          <div className="flex items-center gap-3">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="tracking-[0.2em] uppercase text-amber-100">
              Summoning...
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-3 uppercase tracking-[0.15em] drop-shadow-lg">
            <Icon className="w-5 h-5" />
            <span>{text}</span>
          </div>
        )}
      </span>
    </button>
  );
}

function FeatureIcon({ icon, label }) {
  return (
    <div className="flex flex-col items-center gap-2 group cursor-default opacity-60 hover:opacity-100 transition-all duration-300">
      <div className="text-xl filter grayscale group-hover:grayscale-0 transition-all transform group-hover:-translate-y-1 group-hover:scale-110">
        {icon}
      </div>
      <div className="text-[9px] text-amber-200/80 uppercase tracking-widest font-royal font-semibold">
        {label}
      </div>
    </div>
  );
}

// SEBELUM
