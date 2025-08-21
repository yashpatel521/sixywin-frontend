// utils/storage.ts
import { HMAC_SECRET } from "@/libs/constants";
import { User } from "@/libs/interfaces";
import CryptoJS from "crypto-js";

const STORAGE_KEY = "rememberMe";

export const saveCredentials = (emailOrUsername: string, password: string) => {
  const data = JSON.stringify({ emailOrUsername, password });
  const encrypted = CryptoJS.AES.encrypt(data, HMAC_SECRET).toString();
  localStorage.setItem(STORAGE_KEY, encrypted);
};

export const getCredentials = (): {
  emailOrUsername: string;
  password: string;
} | null => {
  const encrypted = localStorage.getItem(STORAGE_KEY);
  if (!encrypted) return null;

  try {
    const bytes = CryptoJS.AES.decrypt(encrypted, HMAC_SECRET);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decrypted);
  } catch {
    return null;
  }
};

export const clearCredentials = () => {
  localStorage.removeItem(STORAGE_KEY);
};

export const saveUserProfile = (profile: User, token: string | null = null) => {
  localStorage.setItem("user", JSON.stringify(profile));
  if (!token) return;
  localStorage.setItem("token", JSON.stringify(token));
};

export const getUserProfile = () => {
  const user = localStorage.getItem("user");
  const token = localStorage.getItem("token");
  if (!user) return null;
  if (!token) return null;
  try {
    return { user: JSON.parse(user), token: JSON.parse(token) };
  } catch {
    return null;
  }
};

export const clearUserProfile = () => {
  localStorage.removeItem("userProfile");
};
