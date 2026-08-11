import React, { useEffect, useState } from "react";
import { Gauge, ArrowRight } from "lucide-react";
import { hoursToParts } from "../utils/format.js";

export default function IntroScene({ onEnter }) {
  const [demo, setDemo] = useState(50 * 3600);
  useEffect(() => {
    const id = setInterval(() => setDemo((s) => (s <= 0 ? 50 * 3600 : s - 137)), 60);
    return () => clearInterval(id);
  }, []);
  const { hh, mm, ss } = hoursToParts(demo / 3600);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-6">
      <div className="absolute inset-0 opacity-[0.05]" style={{
        backgroundImage: "linear-gradient(#F5A623 1px, transparent 1px), linear-gradient(90deg, #F5A623 1px, transparent 1px)",
        backgroundSize: "42px 42px",
      }} />

      <div className="anim-scale w-16 h-16 rounded-xl bg-[#F5A623] flex items-center justify-center mb-6 anim-float">
        <Gauge size={32} className="text-[#12151A]" strokeWidth={2.5} />
      </div>

      <div className="anim-fadeup disp text-5xl md:text-6xl font-semibold tracking-wide text-center" style={{ animationDelay: ".1s" }}>
        CrewCost
      </div>
      <div className="anim-fadeup text-[#8A93A3] text-sm md:text-base mt-3 text-center max-w-md" style={{ animationDelay: ".2s" }}>
        A labor budget that counts <span className="text-[#F5A623] font-medium">down</span>, not up.
        See exactly how long a crew can keep working before the money runs out.
      </div>

      <div className="anim-fadeup mono text-4xl md:text-5xl mt-10 tracking-wider text-[#E8EAED]/90" style={{ animationDelay: ".32s" }}>
        <span key={hh} className="anim-tick">{String(hh).padStart(2, "0")}</span>
        <span className="text-[#8A93A3]">:</span>
        <span key={mm} className="anim-tick">{String(mm).padStart(2, "0")}</span>
        <span className="text-[#8A93A3]">:</span>
        <span key={ss} className="anim-tick">{String(ss).padStart(2, "0")}</span>
      </div>
      <div className="anim-fadeup text-[10px] disp tracking-[0.2em] text-[#8A93A3] mt-1" style={{ animationDelay: ".38s" }}>
        remaining · simulated
      </div>

      <div className="anim-sweep h-[2px] w-40 bg-[#F5A623] mt-8" style={{ animationDelay: ".5s" }} />

      <button
        onClick={onEnter}
        className="anim-fadeup mt-8 flex items-center gap-2 bg-[#F5A623] text-[#12151A] disp font-semibold tracking-wide text-sm px-6 py-3 rounded-md hover:bg-[#ffb84d] hover:scale-[1.02] active:scale-[.98] transition-all"
        style={{ animationDelay: ".6s" }}
      >
        Enter system <ArrowRight size={16} />
      </button>
    </div>
  );
}
