const API_ORIGIN = "https://api.metaxtrader.com";

export const normalizeImageUrl = (value, { bustCache = false } = {}) => {
  if (!value || typeof value !== "string") return null;

  let url = value.trim();
  if (!url || url === "null" || url === "undefined") return null;

  // If the backend accidentally returns a full URL inside an uploads path, recover it.
  const nestedHttp = url.match(/\/uploads\/(https?:\/\/.+)$/i);
  if (nestedHttp?.[1]) url = nestedHttp[1];

  if (url.startsWith("//")) url = `https:${url}`;

  if (url.startsWith("http://")) url = url.replace(/^http:\/\//i, "https://");

  if (url.startsWith("/uploads/")) url = `${API_ORIGIN}${url}`;
  else if (url.startsWith("uploads/")) url = `${API_ORIGIN}/${url}`;
  else if (url.startsWith("/")) url = `${API_ORIGIN}${url}`;

  if (bustCache && url.includes("/uploads/") && !url.includes("default-avatar")) {
    const joiner = url.includes("?") ? "&" : "?";
    url = `${url}${joiner}v=${Date.now()}`;
  }

  return url;
};

export const getUserAvatarUrl = (user, options = {}) => {
  if (!user) return null;
  return normalizeImageUrl(
    user.profileImage ||
      user.imageUrl ||
      user.profilePicture ||
      user.avatar ||
      user.photo ||
      user.picture,
    options
  );
};
