import React, { useState } from "react";
import { Gauge, LogIn, AlertCircle } from "lucide-react";
import { api, setToken } from "../api.js";

export default function LoginScene({ onLoggedIn }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.login(username.trim(), password);
      setToken(res.token);
      onLoggedIn(res.user);
    } catch (err) {
      setError(err.message || "Login failed");
      setShake(true);
      setTimeout(() => setShake(false), 400);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.05]" style={{
        backgroundImage: "linear-gradient(#F5A623 1px, transparent 1px), linear-gradient(90deg, #F5A623 1px, transparent 1px)",
        backgroundSize: "42px 42px",
      }} />

      <form
        onSubmit={submit}
        className={`anim-scale relative w-full max-w-sm bg-[#171B22] border border-[#252B34] rounded-xl p-7 ${shake ? "anim-shake" : ""}`}
      >
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 rounded-lg bg-[#F5A623] flex items-center justify-center mb-3">
            <Gauge size={24} className="text-[#12151A]" strokeWidth={2.5} />
          </div>
          <div className="disp text-2xl font-semibold tracking-wide">CrewCost</div>
          <div className="text-[11px] disp tracking-wider text-[#8A93A3] mt-1">Admin sign-in</div>
        </div>

        <label className="block text-xs text-[#8A93A3] mb-1.5">Username</label>
        <input
          autoFocus
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="admin"
          className="w-full bg-[#12151A] border border-[#2A303B] rounded-md px-3 py-2.5 text-sm outline-none focus:border-[#F5A623] mb-4"
        />

        <label className="block text-xs text-[#8A93A3] mb-1.5">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="w-full bg-[#12151A] border border-[#2A303B] rounded-md px-3 py-2.5 text-sm outline-none focus:border-[#F5A623] mb-4"
        />

        {error && (
          <div className="flex items-center gap-1.5 text-xs text-[#FF4E33] bg-[#FF4E33]/10 border border-[#FF4E33]/30 rounded-md px-3 py-2 mb-4">
            <AlertCircle size={13} /> {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-[#F5A623] text-[#12151A] disp font-semibold tracking-wide text-sm py-3 rounded-md hover:bg-[#ffb84d] transition-colors disabled:opacity-60"
        >
          <LogIn size={16} /> {loading ? "Signing in…" : "Sign in"}
        </button>

        <div className="text-center text-[11px] text-[#8A93A3] mt-5">
          Demo account — <span className="mono text-[#E8EAED]">admin</span> / <span className="mono text-[#E8EAED]">admin123</span>
          <br />Set your own in <span className="mono">server/.env</span> before deploying.
        </div>
      </form>
    </div>
  );
}
