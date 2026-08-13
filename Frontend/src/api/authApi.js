
import api from "./axios";

export const loginUser = async (
  email,
  password
) => {
  const response = await api.post(
    "/auth/login",
    {
      email,
      password,
    }
  );

  const data = response.data;

  const accessToken =
    data.AccessToken ||
    data.accessToken;

  const refreshToken =
    data.RefreshToken ||
    data.refreshToken;

  if (!accessToken || !refreshToken) {
    throw new Error(
      "Tokens were not received from server"
    );
  }

  localStorage.setItem(
    "accessToken",
    accessToken
  );

  localStorage.setItem(
    "refreshToken",
    refreshToken
  );

  return data;
};


export const registerUser = async (
  name,
  email,
  password
) => {
  const response = await api.post(
    "/auth/register",
    {
      name,
      email,
      password,
    }
  );

  return response.data;
};


export const logoutUser = async () => {
  try {
    await api.post(
      "/auth/logout"
    );
  } finally {
    localStorage.removeItem(
      "accessToken"
    );

    localStorage.removeItem(
      "refreshToken"
    );
  }
};

