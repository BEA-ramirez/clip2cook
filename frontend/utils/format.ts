const FRACTIONS = [
  { val: 0, text: "" },
  { val: 1 / 16, text: "1/16" },
  { val: 1 / 8, text: "1/8" },
  { val: 1 / 6, text: "1/6" },
  { val: 1 / 4, text: "1/4" },
  { val: 1 / 3, text: "1/3" },
  { val: 3 / 8, text: "3/8" },
  { val: 1 / 2, text: "1/2" },
  { val: 5 / 8, text: "5/8" },
  { val: 2 / 3, text: "2/3" },
  { val: 3 / 4, text: "3/4" },
  { val: 7 / 8, text: "7/8" },
];

function formatCookingQuantity(decimalValue: number): string {
  if (!isFinite(decimalValue)) return "";
  if (decimalValue <= 0) return "0";

  const whole = Math.floor(decimalValue);
  const frac = decimalValue - whole;

  let closest = FRACTIONS[0];
  let minDiff = Infinity;
  for (const f of FRACTIONS) {
    const d = Math.abs(frac - f.val);
    if (d < minDiff) {
      minDiff = d;
      closest = f;
    }
  }

  // Tolerance: 1/16 of a unit. Anything within that snaps to the fraction.
  // If you want stricter matching (e.g. keep 0.1 as 0.1), lower this.
  const TOLERANCE = 1 / 16;

  if (minDiff > TOLERANCE) {
    // Not close enough to a common kitchen fraction — return a clean decimal.
    return Number(decimalValue.toFixed(2)).toString().replace(/\.0+$/, "");
  }

  if (whole === 0 && closest.text === "") return "0";
  if (whole === 0) return closest.text;
  if (closest.text === "") return whole.toString();
  return `${whole} ${closest.text}`;
}

export function scaleQuantity(
  rawQty: string | number | null | undefined,
  originalServings: number,
  newServings: number,
): string {
  if (rawQty === null || rawQty === undefined) return "";
  const s = String(rawQty).trim();
  if (!s) return "";

  // If it's clearly non-numeric text like "to taste" / "a pinch" — pass through
  if (!/[\d]/.test(s)) return s;

  let value: number;

  // Mixed: "1 1/2" or "1-1/2"
  const mixed = s.match(/^(\d+)\s+(\d+)\/(\d+)$/);
  if (mixed) {
    const [, w, n, d] = mixed;
    value = Number(w) + Number(n) / Number(d);
  }
  // Plain fraction: "1/2"
  else if (/^\d+\/\d+$/.test(s)) {
    const [n, d] = s.split("/").map(Number);
    value = n / d;
  }
  // Decimal or integer: "2", "0.5"
  else if (!isNaN(parseFloat(s)) && /^\d*\.?\d+$/.test(s)) {
    value = parseFloat(s);
  } else {
    // Unknown numeric-ish string — fall back safely
    return s;
  }

  if (!isFinite(value)) return s;

  const base = originalServings > 0 ? originalServings : 1;
  const target = newServings > 0 ? newServings : 1;
  const scaled = value * (target / base);

  return formatCookingQuantity(scaled);
}
