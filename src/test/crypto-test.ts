// Simple test for HMAC functionality
import { createSignedMessage, verifyMessageSignature } from "../lib/crypto";

// Test HMAC signing and verification
console.log("🔐 Testing HMAC Message Signing...");

// Create a test message
const testMessage = createSignedMessage("test_message", {
  username: "testuser",
  action: "login",
});

console.log("✅ Generated signed message:", testMessage);

// Verify the signature
const isValid = verifyMessageSignature(testMessage);
console.log("✅ Signature verification:", isValid ? "VALID" : "INVALID");

// Test with tampered message
const tamperedMessage = {
  ...testMessage,
  payload: { username: "hacker", action: "login" }, // Changed payload
};

const isTamperedValid = verifyMessageSignature(tamperedMessage);
console.log(
  "🚫 Tampered message verification:",
  isTamperedValid ? "VALID (BAD!)" : "INVALID (GOOD!)"
);

export { testMessage, isValid, isTamperedValid };
