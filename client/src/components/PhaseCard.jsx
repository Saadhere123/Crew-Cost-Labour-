import React from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

export function PhaseCard({ title, subtitle, children }) {
  return (
    <div className="bg-[#171B22] border border-[#252B34] rounded-xl p-6">
      <div className="disp text-xl font-semibold mb-1">{title}</div>
      <div className="text-sm text-[#8A93A3] mb-5">{subtitle}</div>
      {children}
    </div>
  );
}

export function PhaseFooter({ onBack, onNext, nextLabel, nextIcon }) {
  return (
    <div className="flex justify-between items-center mt-6 pt-5 border-t border-[#242B35]">
      {onBack ? (
        <button onClick={onBack} className="flex items-center gap-1.5 text-xs font-medium text-[#8A93A3] hover:text-[#E8EAED] px-3 py-2">
          <ArrowLeft size={14} /> Back
        </button>
      ) : <span />}
      <button
        onClick={onNext}
        className="flex items-center gap-1.5 bg-[#F5A623] text-[#12151A] disp text-sm font-semibold tracking-wide px-5 py-2.5 rounded-md hover:bg-[#ffb84d] hover:scale-[1.02] active:scale-[.98] transition-all"
      >
        {nextLabel} {nextIcon || <ArrowRight size={15} />}
      </button>
    </div>
  );
}
