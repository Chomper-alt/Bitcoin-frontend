export const normalizeImageUrl = (val) => {
  if (!val) return null;

  // Already absolute HTTPS
  if (val.startsWith("https://")) return val;

  // Fix accidental http
  if (val.startsWith("http://")) {
    return val.replace("http://", "https://");
  }

  // Relative uploads path
  if (val.startsWith("/uploads")) {
    return `https://api.metaxtrader.com${val}`;
  }

  return val;
};
