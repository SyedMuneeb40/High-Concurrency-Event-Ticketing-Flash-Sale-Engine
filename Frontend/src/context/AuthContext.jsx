import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  loginUser,
  logoutUser,
  registerUser,
} from "../api/authApi";

const AuthContext = createContext();

const decodeToken = (token) => {
  try {
    const payload = token.split(".")[1];

    return JSON.parse(
      atob(
        payload
          .replace(/-/g, "+")
          .replace(/_/g, "/")
      )
    );
  } catch {
    return null;
  }
};

const getRoleFromToken = (token) => {
  const decoded = decodeToken(token);

  if (!decoded) return null;

  const role =
    decoded.role ||
    decoded.roles ||
    decoded.authorities;

  if (Array.isArray(role)) {
    return role[0];
  }

  return role;
};

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("accessToken")
  );

  const [user, setUser] = useState(null);

  useEffect(() => {
    if (accessToken) {
      const decoded = decodeToken(accessToken);

      setUser({
        ...decoded,
        role: getRoleFromToken(accessToken),
      });
    } else {
      setUser(null);
    }
  }, [accessToken]);

  const login = async (credentials) => {
    const data = await loginUser(credentials);

    localStorage.setItem(
      "accessToken",
      data.AccessToken
    );

    localStorage.setItem(
      "refreshToken",
      data.RefreshToken
    );

    setAccessToken(data.AccessToken);

    return data;
  };

  const register = async (data) => {
    return await registerUser(data);
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error(error);
    }

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    setAccessToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isAuthenticated: !!accessToken,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};