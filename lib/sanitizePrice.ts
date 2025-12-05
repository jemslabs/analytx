
export function sanitizePrice(value: string): string {
  let sanitized = value.replace(/[^0-9.]/g, "");

  const [intPart, ...rest] = sanitized.split(".");
  sanitized = intPart + (rest.length ? "." + rest.join("") : "");

  return sanitized;
}
