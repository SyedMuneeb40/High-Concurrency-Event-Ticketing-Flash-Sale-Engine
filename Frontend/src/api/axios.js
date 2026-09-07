import axios from "axios";

const API_URL = "https://flash-ticket-backend.onrender.com";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/*
 * Request Interceptor: Attach Bearer token except for explicit auth endpoints
 */
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");

    // Only bypass adding access token for login, register & verify/refresh endpoints
    const isAuthRoute =
      config.url?.includes("/auth/login") ||
      config.url?.includes("/auth/register") ||
      config.url?.includes("/auth/verify");

    if (accessToken && !isAuthRoute) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let refreshSubscribers = [];

const subscribeTokenRefresh = (callback) => {
  refreshSubscribers.push(callback);
};

const onRefreshed = (newAccessToken) => {
  refreshSubscribers.forEach((callback) => callback(newAccessToken));
  refreshSubscribers = [];
};

const clearAuth = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};

/*
 * Response Interceptor: Handles 401 & Silent Refresh Token logic
 */
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!error.response || error.response.status !== 401) {
      return Promise.reject(error);
    }

    // Prevent infinite loop if the refresh endpoint itself throws 401
    if (
      originalRequest.url?.includes("/auth/verify") ||
      originalRequest.url?.includes("/auth/refresh") ||
      originalRequest._retry
    ) {
      clearAuth();
      window.location.href = "/login";
      return Promise.reject(error);
    }

    originalRequest._retry = true;
    const refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) {
      clearAuth();
      window.location.href = "/login";
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        subscribeTokenRefresh((newAccessToken) => {
          if (!newAccessToken) {
            reject(error);
            return;
          }
          // Correct Axios v1 headers update syntax
          originalRequest.headers.set
            ? originalRequest.headers.set("Authorization", `Bearer ${newAccessToken}`)
            : (originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`);

          resolve(api(originalRequest));
        });
      });
    }

    isRefreshing = true;

    try {
      // Backend Refresh API call
      const response = await axios.post(
        `${API_URL}/auth/verify`,
        { refreshToken },
        { headers: { "Content-Type": "application/json" } }
      );

      const data = response.data;

      // Multi-fallback for Access / Refresh Tokens
      const newAccessToken =
        data?.AccessToken ||
        data?.accessToken ||
        data?.token ||
        data?.jwt;

      const newRefreshToken =
        data?.RefreshToken ||
        data?.refreshToken;

      if (!newAccessToken) {
        throw new Error("New access token not provided by backend endpoint");
      }

      localStorage.setItem("accessToken", newAccessToken);
      if (newRefreshToken) {
        localStorage.setItem("refreshToken", newRefreshToken);
      }

      onRefreshed(newAccessToken);

      // Set new header for original failed request and retry
      if (originalRequest.headers.set) {
        originalRequest.headers.set("Authorization", `Bearer ${newAccessToken}`);
      } else {
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
      }

      return api(originalRequest);
    } catch (refreshError) {
      refreshSubscribers.forEach((callback) => callback(null));
      refreshSubscribers = [];
      clearAuth();
      window.location.href = "/login";
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;