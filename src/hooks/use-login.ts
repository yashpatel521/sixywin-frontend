import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { wsClient } from "@/websocket";
import { MESSAGE_TYPES } from "@/websocket/constants";
import {
  rememberMeStorage,
  tokenStorage,
  userStorage,
} from "@/lib/localStorage";
import type { LoginFormData, UseLoginReturn } from "@/lib/interfaces";

export function useLogin(): UseLoginReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const login = async (
    formData: LoginFormData,
    rememberMe: boolean
  ): Promise<boolean> => {
    setError("");
    setIsLoading(true);

    try {
      // Wait for WebSocket connection if not connected
      if (!wsClient.isConnected()) {
        setError("Connecting to server...");

        const connectionTimeout = setTimeout(() => {
          setError("Connection failed. Please refresh the page and try again.");
          setIsLoading(false);
        }, 5000);

        const connectionCheckInterval = setInterval(() => {
          if (wsClient.isConnected()) {
            clearTimeout(connectionTimeout);
            clearInterval(connectionCheckInterval);
            sendLoginRequest(formData, rememberMe);
          }
        }, 100);

        return false;
      }

      return await sendLoginRequest(formData, rememberMe);
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
      return false;
    }
  };

  const sendLoginRequest = (
    formData: LoginFormData,
    rememberMe: boolean
  ): Promise<boolean> => {
    return new Promise((resolve) => {
      const requestId = Date.now().toString();
      let handleLoginResponse: (message: any) => void;
      let timeoutId: NodeJS.Timeout;

      handleLoginResponse = (message: any) => {
        // Handle both the new message type and legacy
        if (message.type === "login_response" || message.type === "error") {
          // Handle both regular responses (with requestId) and broadcast updates (without requestId)
          if (message.requestId && message.requestId === requestId) {
            // This is a response to our request
            if (timeoutId) {
              clearTimeout(timeoutId);
            }

            // Handle error responses from new WebSocket server
            if (message.type === "error") {
              setError(message.message || "Login failed. Please try again.");
              setIsLoading(false);
              resolve(false);
            } else if (message.payload?.success) {
              // Login successful
              userStorage.setUser(message.payload.data.user);
              tokenStorage.setToken(message.payload.data.token);

              // Update remember me data after successful login if checkbox is checked
              if (rememberMe) {
                rememberMeStorage.setRememberData(
                  formData.emailOrUsername,
                  formData.password
                );
              } else {
                rememberMeStorage.removeRememberData();
              }

              setIsLoading(false);
              navigate("/games");
              resolve(true);
            } else {
              // Login failed
              setError(
                message.payload?.message || "Login failed. Please try again."
              );
              setIsLoading(false);
              resolve(false);
            }

            // Cleanup
            wsClient.off("login_response", handleLoginResponse);
            wsClient.off("error", handleLoginResponse);
          } else if (!message.requestId) {
            // This is a broadcast update - we don't need to handle this for login
            // but we should not interfere with it either
          }
        }
      };

      // Listen for both response types
      wsClient.on("login_response", handleLoginResponse);
      wsClient.on("error", handleLoginResponse);

      // Send login request via WebSocket using the new message format
      const success = wsClient.send({
        type: MESSAGE_TYPES.LOGIN,
        payload: {
          emailOrUsername: formData.emailOrUsername,
          password: formData.password,
        },
        requestId: requestId,
        timestamp: new Date().toISOString(),
      });

      if (!success) {
        setError("Failed to send login request. Please check your connection.");
        setIsLoading(false);
        wsClient.off("login_response", handleLoginResponse);
        wsClient.off("error", handleLoginResponse);
        resolve(false);
        return;
      }

      // Timeout after 10 seconds
      timeoutId = setTimeout(() => {
        wsClient.off("login_response", handleLoginResponse);
        wsClient.off("error", handleLoginResponse);
        setError("Login timeout. Please try again.");
        setIsLoading(false);
        resolve(false);
      }, 10000);
    });
  };

  return {
    isLoading,
    error,
    login,
  };
}
