import CryptoJS from "crypto-js";

// Use environment variable for secret key in production
const SECRET_KEY =
  import.meta.env.VITE_HMAC_SECRET || "sixywin-development-secret-key-2025";

/**
 * Hash password with HMAC secret as salt for secure transmission
 * This prevents plain text passwords from being visible in network traffic
 * Uses the same secret as HMAC to ensure consistency between client and server
 */
export function hashPassword(password: string, salt?: string): string {
  const passwordSalt = salt || SECRET_KEY; // Use HMAC secret as default salt
  return CryptoJS.SHA256(password + passwordSalt).toString();
}

/**
 * Create HMAC-SHA256 signature for a given data string
 */
export function createHMAC(data: string): string {
  return CryptoJS.HmacSHA256(data, SECRET_KEY).toString();
}

/**
 * Verify HMAC signature against expected data
 */
export function verifyHMAC(data: string, signature: string): boolean {
  const computedSignature = createHMAC(data);
  return computedSignature === signature;
}

/**
 * Create signature for WebSocket message
 * Signs: requestId + timestamp + stringified payload
 */
export function signMessage(message: {
  requestId: string;
  timestamp: string;
  payload: unknown;
}): string {
  const dataToSign =
    message.requestId + message.timestamp + JSON.stringify(message.payload);
  return createHMAC(dataToSign);
}

/**
 * Verify WebSocket message signature
 */
export function verifyMessageSignature(message: {
  requestId: string;
  timestamp: string;
  payload: unknown;
  signature: string;
}): boolean {
  const dataToVerify =
    message.requestId + message.timestamp + JSON.stringify(message.payload);
  return verifyHMAC(dataToVerify, message.signature);
}

/**
 * Create signed WebSocket message with HMAC signature
 */
export function createSignedMessage(
  type: string,
  payload: unknown,
  requestId?: string
): {
  type: string;
  payload: unknown;
  requestId: string;
  timestamp: string;
  signature: string;
} {
  const message = {
    type,
    payload,
    requestId: requestId || Date.now().toString(),
    timestamp: new Date().toISOString(),
  };

  const signature = signMessage(message);

  return {
    ...message,
    signature,
  };
}
