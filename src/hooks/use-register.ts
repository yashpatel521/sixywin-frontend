import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { wsClient } from "@/websocket";
import { MESSAGE_TYPES } from "@/websocket/constants";
import { tokenStorage, userStorage } from "@/lib/localStorage";

interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  referralId?: string;
}

interface UseRegisterReturn {
  isLoading: boolean;
  error: string;
  isPasswordValid: boolean;
  register: (formData: RegisterFormData) => Promise<boolean>;
  validatePasswords: (password: string, confirmPassword: string) => void;
}

export function useRegister(): UseRegisterReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const navigate = useNavigate();

  const register = async (formData: RegisterFormData): Promise<boolean> => {
    setError("");

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    if (!formData.password || formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }

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
            sendRegisterRequest(formData);
          }
        }, 100);

        return false;
      }

      return await sendRegisterRequest(formData);
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
      return false;
    }
  };

  const sendRegisterRequest = (
    formData: RegisterFormData
  ): Promise<boolean> => {
    return new Promise((resolve) => {
      const requestId = Date.now().toString();
      let handleRegisterResponse: (message: any) => void;
      let timeoutId: NodeJS.Timeout;

      handleRegisterResponse = (message: any) => {
        if (message.type === "register_response") {
          // Handle both regular responses (with requestId) and broadcast updates (without requestId)
          if (message.requestId && message.requestId === requestId) {
            // This is a response to our request
            if (timeoutId) {
              clearTimeout(timeoutId);
            }

            if (message.payload.success) {
              // Registration successful
              tokenStorage.setToken(message.payload.data.token);
              userStorage.setUser(message.payload.data.user);

              setIsLoading(false);
              navigate("/games");
              resolve(true);
            } else {
              // Registration failed
              setError(
                message.payload.message ||
                  "Registration failed. Please try again."
              );
              setIsLoading(false);
              resolve(false);
            }

            // Cleanup
            wsClient.off("register_response", handleRegisterResponse);
          } else if (!message.requestId) {
            // This is a broadcast update - we don't need to handle this for registration
            // but we should not interfere with it either
          }
        }
      };

      // Listen for response
      wsClient.on("register_response", handleRegisterResponse);

      // Send register request via WebSocket
      const success = wsClient.send({
        type: MESSAGE_TYPES.REGISTER,
        payload: {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          referralId: formData.referralId,
        },
        requestId: requestId,
        timestamp: new Date().toISOString(),
      });

      if (!success) {
        setError(
          "Failed to send registration request. Please check your connection."
        );
        setIsLoading(false);
        wsClient.off("register_response", handleRegisterResponse);
        resolve(false);
        return;
      }

      // Timeout after 10 seconds
      timeoutId = setTimeout(() => {
        wsClient.off("register_response", handleRegisterResponse);
        setError("Registration timeout. Please try again.");
        setIsLoading(false);
        resolve(false);
      }, 10000);
    });
  };

  // Password validation helper
  const validatePasswords = (password: string, confirmPassword: string) => {
    if (password === "" || confirmPassword === "") {
      setIsPasswordValid(true);
      return;
    }
    setIsPasswordValid(password === confirmPassword);
  };

  return {
    isLoading,
    error,
    isPasswordValid,
    register,
    validatePasswords,
  };
}
