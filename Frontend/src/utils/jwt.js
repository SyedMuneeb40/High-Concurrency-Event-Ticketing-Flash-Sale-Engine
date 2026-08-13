import { jwtDecode } from "jwt-decode";

export const getUserRole = () => {
  const token = localStorage.getItem("accessToken");
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    
    // Checks all possible payload structures for role/authorities
    const rawRole = decoded.role || decoded.roles || decoded.authorities;

    if (Array.isArray(rawRole)) {
      const firstRole = rawRole[0];
      return typeof firstRole === "object" ? firstRole.authority : firstRole;
    }

    return rawRole;
  } catch (error) {
    console.error("Error decoding JWT token:", error);
    return null;
  }
};