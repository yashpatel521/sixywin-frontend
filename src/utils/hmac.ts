import { HMAC_SECRET } from "@/libs/constants";
import CryptoJS from "crypto-js";

export const generateHmacSignature = (data: string): string => {
  return CryptoJS.HmacSHA256(data, HMAC_SECRET).toString(CryptoJS.enc.Hex);
};

export function hashPassword(password: string, salt?: string): string {
  const passwordSalt = salt || HMAC_SECRET; // Use HMAC secret as default salt
  return CryptoJS.SHA256(password + passwordSalt).toString();
}
