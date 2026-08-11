import React from "react";

export default function BudgetGauge({ pctRemaining, exhausted }) {
  const r = 80, cx = 100, cy = 100;
  const circumference = Math.PI * r;
  const startAngle = 180, endAngle = 0;
  const angle = startAngle - (startAngle - endAngle) * (pctRemaining / 100);
  const toXY = (deg) => {
    const rad = (deg * Math.PI) / 180;
    return [cx + r * Math.cos(rad), cy - r * Math.sin(rad)];
  };
  const [nx, ny] = toXY(angle);
  const color = exhausted ? "#FF4E33" : pctRemaining < 20 ? "#FF4E33" : pctRemaining < 45 ? "#F5A623" : "#3DDC84";
  const offset = circumference * (1 - pctRemaining / 100);

  return (
    <svg viewBox="0 0 200 115" className="w-full max-w-[260px]">
      <path d={`M 20 100 A ${r} ${r} 0 0 1 180 100`} stroke="#242B35" strokeWidth="14" fill="none" strokeLinecap="round" />
      <path
        d={`M 20 100 A ${r} ${r} 0 0 1 180 100`}
        stroke={color} strokeWidth="14" fill="none" strokeLinecap="round"
        strokeDasharray={circumference} strokeDashoffset={offset}
        className="gauge-arc"
      />
      <line x1={cx} y1={cy} x2={nx} y2={ny} stroke="#E8EAED" strokeWidth="2.5" className="gauge-needle" style={{ transformOrigin: `${cx}px ${cy}px` }} />
      <circle cx={cx} cy={cy} r="5" fill="#E8EAED" />
    </svg>
  );
}
