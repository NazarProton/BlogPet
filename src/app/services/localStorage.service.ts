import { IUser } from "./../components/ComponentsTypes";
const TOKEN_KEY = "jwt-token";
const REFRESH_KEY = "jwt-refresh-token";
const EXPIRES_KEY = "jwt-expires";
const USERID_KEY = "user-local-id";
const currentUserData = "current-user";
const currentTheme = "current-theme";
localStorage.setItem(
  currentTheme,
  localStorage.getItem(currentTheme) || "light"
);

export function setTokens(data: string, currentUser: IUser, expiresIn = 3600) {
  const expiresDate = JSON.stringify(new Date().getTime() + expiresIn * 1000);
  localStorage.setItem(USERID_KEY, currentUser._id);
  localStorage.setItem(TOKEN_KEY, data);
  localStorage.setItem(REFRESH_KEY, data);
  localStorage.setItem(EXPIRES_KEY, expiresDate);
  localStorage.setItem(currentUserData, JSON.stringify(currentUser));
}
export function setTheme() {
  const theme = localStorage.getItem(currentTheme);
  localStorage.setItem(currentTheme, theme === "light" ? "dark" : "light");
}
export function updateCurrentUser(data: IUser) {
  const currentUser = JSON.parse(localStorage.getItem(currentUserData) || "");
  localStorage.setItem(
    currentUserData,
    JSON.stringify({ ...currentUser, ...data })
  );
}

export function getAccessToken() {
  return localStorage.getItem(TOKEN_KEY);
}
export function getItem() {
  return localStorage.getItem(currentTheme);
}
export function getCurrentUser() {
  return localStorage.getItem(currentUserData);
}
export function getRefreshToken() {
  return localStorage.getItem(REFRESH_KEY);
}
export function removeAuthData() {
  localStorage.removeItem(USERID_KEY);
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(EXPIRES_KEY);
  localStorage.removeItem(currentUserData);
}
export function getTokenExpiresDate() {
  return localStorage.getItem(EXPIRES_KEY);
}
export function getUserId() {
  return localStorage.getItem(USERID_KEY);
}
export function getTheme() {
  return localStorage.getItem(currentTheme);
}

const localStorageService = {
  setTokens,
  updateCurrentUser,
  getAccessToken,
  getRefreshToken,
  getTokenExpiresDate,
  getUserId,
  removeAuthData,
  getCurrentUser,
  setTheme,
  getTheme,
};

export default localStorageService;
