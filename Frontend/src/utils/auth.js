export const getAccessToken = () => {
  return localStorage.getItem("accessToken");
};

export const getRefreshToken = () => {
  return localStorage.getItem("refreshToken");
};


export const saveTokens = (
  accessToken,
  refreshToken
) => {

  if (accessToken) {
    localStorage.setItem(
      "accessToken",
      accessToken
    );
  }

  if (refreshToken) {
    localStorage.setItem(
      "refreshToken",
      refreshToken
    );
  }
};


export const clearTokens = () => {

  localStorage.removeItem(
    "accessToken"
  );

  localStorage.removeItem(
    "refreshToken"
  );

  localStorage.removeItem(
    "user"
  );
};


export const isLoggedIn = () => {
  return Boolean(
    getAccessToken()
  );
};


export const getStoredUser = () => {

  const user =
    localStorage.getItem("user");

  if (!user) {
    return null;
  }

  try {

    return JSON.parse(user);

  } catch {

    return null;

  }
};