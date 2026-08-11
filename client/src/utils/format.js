export const money = (n) =>
  (n < 0 ? "-$" : "$") + Math.abs(n).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });

export const moneyPrecise = (n) =>
  (n < 0 ? "-$" : "$") + Math.abs(n).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function hoursToParts(h) {
  const totalSeconds = Math.max(0, Math.round(h * 3600));
  return {
    hh: Math.floor(totalSeconds / 3600),
    mm: Math.floor((totalSeconds % 3600) / 60),
    ss: totalSeconds % 60,
  };
}
