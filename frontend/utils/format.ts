function formatCookingQuantity(decimalValue: number): string {
  // 1. Separate the whole number from the decimal part
  const whole = Math.floor(decimalValue);
  const fraction = decimalValue - whole;

  // 2. Define standard cooking measurements
  const fractions = [
    { val: 0, text: "" },
    { val: 0.125, text: "1/8" },
    { val: 0.25, text: "1/4" },
    { val: 0.333, text: "1/3" },
    { val: 0.5, text: "1/2" },
    { val: 0.666, text: "2/3" },
    { val: 0.75, text: "3/4" },
  ];

  // 3. Find the closest matching fraction (handles floating point weirdness)
  let closest = fractions[0];
  let minDiff = 1;

  for (const f of fractions) {
    const diff = Math.abs(fraction - f.val);
    if (diff < minDiff) {
      minDiff = diff;
      closest = f;
    }
  }

  // 4. Fallback: If it's a weird decimal (e.g. 0.9) that doesn't map to a measuring cup,
  // just round it to 1 decimal place so it doesn't look broken.
  if (minDiff > 0.05) {
    return Number(decimalValue.toFixed(1)).toString();
  }

  // 5. Combine and format the output beautifully!
  if (whole === 0 && closest.text === "") return "0"; // Failsafe
  if (whole === 0) return closest.text; // e.g., "1/2"
  if (closest.text === "") return whole.toString(); // e.g., "2"

  return `${whole} ${closest.text}`; // e.g., "1 1/2"
}

export function scaleQuantity(
  rawQty: string | number | null | undefined,
  originalServings: number,
  newServings: number,
): string {
  // 1. Guard against empty/null values
  if (rawQty === null || rawQty === undefined || rawQty === "") return "";

  // 2. Coerce to string at runtime in case a number was passed
  const qtyString = String(rawQty).trim();
  if (!qtyString) return "";

  // 3. Ignore text like "to taste" or "a pinch"
  if (isNaN(parseFloat(qtyString)) && !qtyString.includes("/")) {
    return qtyString;
  }

  // 4. Parse strings or fractions into a raw decimal
  let numericValue = 0;
  if (qtyString.includes("/")) {
    const parts = qtyString.split(" ");

    if (parts.length > 1) {
      // Handles mixed fractions like "1 1/2"
      const whole = parseFloat(parts[0]) || 0;
      const [top, bottom] = parts[1].split("/");
      numericValue = whole + parseFloat(top) / parseFloat(bottom);
    } else {
      // Handles simple fractions like "1/2"
      const [top, bottom] = qtyString.split("/");
      numericValue = parseFloat(top) / parseFloat(bottom);
    }
  } else {
    numericValue = parseFloat(qtyString);
  }

  // If parsing failed to produce a valid number, return original string safely
  if (isNaN(numericValue)) return qtyString;

  // 5. Guard against 0 or negative base servings
  const baseServings = originalServings > 0 ? originalServings : 1;
  const targetServings = newServings > 0 ? newServings : 1;

  const multiplier = targetServings / baseServings;
  const scaledValue = numericValue * multiplier;

  // 6. Format and return
  return formatCookingQuantity(scaledValue);
}
