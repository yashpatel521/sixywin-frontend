/**
 * Application Version Information
 * Update this file on every release/deployment
 */

export const APP_VERSION = {
  // Semantic versioning: MAJOR.MINOR.PATCH
  VERSION: "1.2.0",

  // Build information
  BUILD_DATE: "2025-08-03",
  BUILD_NUMBER: "20250803-001",

  // Git information (update manually or via CI/CD)
  COMMIT_HASH: "4306dc5", // Latest frontend commit
  BRANCH: "development",

  // Environment
  ENVIRONMENT: import.meta.env.MODE || "development",

  // Feature flags/compatibility
  WEBSOCKET_VERSION: "2.0", // Updated message type system
  API_VERSION: "v1",

  // Display helpers
  get FULL_VERSION() {
    return `${this.VERSION}-${this.BUILD_NUMBER}`;
  },

  get VERSION_INFO() {
    return {
      version: this.VERSION,
      buildDate: this.BUILD_DATE,
      environment: this.ENVIRONMENT,
      commit: this.COMMIT_HASH,
      websocketVersion: this.WEBSOCKET_VERSION,
    };
  },
} as const;

// Console log version info in development
if (import.meta.env.DEV) {
  console.log("🚀 SixyWin Frontend", APP_VERSION.VERSION_INFO);
}
