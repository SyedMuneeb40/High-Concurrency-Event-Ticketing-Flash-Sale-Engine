const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8080";

export const getImageUrl = (imageUrl) => {
  if (!imageUrl) {
    return "";
  }

  if (
    imageUrl.startsWith("http://") ||
    imageUrl.startsWith("https://")
  ) {
    return imageUrl;
  }

  const cleanPath = imageUrl.replace(/^\/+/, "");

  return `${API_URL}/${cleanPath}`;
};