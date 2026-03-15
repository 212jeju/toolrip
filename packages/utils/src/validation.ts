/**
 * Check whether a string looks like a valid email address.
 * Uses a simple but reasonable regex -- not RFC 5322 exhaustive.
 */
export function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

/**
 * Check whether a string is a valid URL (http or https).
 */
export function isUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Check whether a value is "empty":
 * - null / undefined
 * - empty string (after trimming)
 * - empty array
 * - object with no own enumerable keys
 */
export function isEmpty(
  value: unknown
): value is null | undefined | "" | never[] {
  if (value == null) return true;
  if (typeof value === "string") return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === "object") return Object.keys(value).length === 0;
  return false;
}
