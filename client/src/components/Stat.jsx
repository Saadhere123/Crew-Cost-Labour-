import React from "react";

export default function Stat({ label, value, accent }) {
  return (
    <div className="bg-[#171B22] border border-[#252B34] rounded-lg px-4 py-3 hover:border-[#3a4250] transition-colors">
      <div className="text-[10px] disp tracking-wider text-[#8A93A3] mb-1">{label}</div>
      <div className="mono text-lg font-medium" style={accent ? { color: accent } : undefined}>{value}</div>
    </div>
  );
}
