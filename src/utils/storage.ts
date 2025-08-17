// utils/storage.ts
import CryptoJS from "crypto-js";

const STORAGE_KEY = "rememberMe";
const VITE_HMAC_SECRET = import.meta.env.VITE_HMAC_SECRET; // ⚠️ change this to a stronger secret

export const saveCredentials = (emailOrUsername: string, password: string) => {
  const data = JSON.stringify({ emailOrUsername, password });
  const encrypted = CryptoJS.AES.encrypt(data, VITE_HMAC_SECRET).toString();
  localStorage.setItem(STORAGE_KEY, encrypted);
};

export const getCredentials = (): {
  emailOrUsername: string;
  password: string;
} | null => {
  const encrypted = localStorage.getItem(STORAGE_KEY);
  if (!encrypted) return null;

  try {
    const bytes = CryptoJS.AES.decrypt(encrypted, VITE_HMAC_SECRET);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decrypted);
  } catch {
    return null;
  }
};

export const clearCredentials = () => {
  localStorage.removeItem(STORAGE_KEY);
};
