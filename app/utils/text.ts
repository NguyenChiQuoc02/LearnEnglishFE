/**
 * Strips Vietnamese diacritics and lowercases, so "da nang" and "Đà Nẵng"
 * normalize to the same string for approximate/accent-insensitive search.
 */
export function normalizeVietnamese(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim();
}
