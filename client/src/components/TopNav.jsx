import React from "react";
import { Gauge, Pause, Play, LayoutDashboard, Settings, LogOut } from "lucide-react";

export default function TopNav({ screen, setScreen, paused, onTogglePause, onLogout }) {
  return (
    <header className="border-b border-[#252B34] px-6 py-3 flex items-center justify-between gap-4 flex-wrap sticky top-0 bg-[#12151A]/95 backdrop-blur z-20">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-md bg-[#F5A623] flex items-center justify-center shrink-0">
            <Gauge size={17} className="text-[#12151A]" strokeWidth={2.5} />
          </div>
          <div className="disp text-lg leading-none font-semibold tracking-wide">CrewCost</div>
        </div>
        <nav className="flex items-center gap-1 bg-[#171B22] border border-[#252B34] rounded-lg p-1">
          <NavTab active={screen === "dashboard"} onClick={() => setScreen("dashboard")} icon={<LayoutDashboard size={14} />} label="Dashboard" />
          <NavTab active={screen === "admin"} onClick={() => setScreen("admin")} icon={<Settings size={14} />} label="Admin" />
        </nav>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onTogglePause}
          className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-md border border-[#2A303B] bg-[#1C2129] hover:bg-[#242B35] transition-colors"
        >
          {paused ? <Play size={14} /> : <Pause size={14} />}
          {paused ? "Resume" : "Pause"}
        </button>
        <button
          onClick={onLogout}
          className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-md border border-[#2A303B] bg-[#1C2129] hover:bg-[#242B35] hover:text-[#FF4E33] transition-colors"
        >
          <LogOut size={14} /> Log out
        </button>
      </div>
    </header>
  );
}

function NavTab({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md transition-all ${
        active ? "bg-[#F5A623] text-[#12151A]" : "text-[#8A93A3] hover:text-[#E8EAED]"
      }`}
    >
      {icon} {label}
    </button>
  );
}
