const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:8080";

export const getImageUrl = (imageUrl) => {
  if (!imageUrl) {
    return "";
  }

  // Already complete URL
  if (
    imageUrl.startsWith("http://") ||
    imageUrl.startsWith("https://")
  ) {
    return imageUrl;
  }

  // Remove leading slash
  let cleanPath = imageUrl.startsWith("/")
    ? imageUrl.substring(1)
    : imageUrl;

  // IMPORTANT:
  // Backend/database may return "uploads/events/..."
  // Actual Render folder is "Uploads/Events/..."
  cleanPath = cleanPath.replace(
    /^uploads\/events\//i,
    "uploads/Events/"
  );

  return `${API_URL}/${cleanPath}`;
};