import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { wsClient } from "@/websocket";
import { MESSAGE_TYPES } from "@/websocket/constants";
import { tokenStorage, userStorage } from "@/lib/localStorage";
import { useToast } from "@/hooks/use-toast";
import { createSignedMessage, hashPassword } from "@/lib/crypto";
import type { RegisterFormData, UseRegisterReturn } from "@/lib/interfaces";

export function useRegister(): UseRegisterReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Refs to prevent stale closures in timeouts
  const isLoadingRef = useRef(isLoading);

  // Keep refs in sync with state
  useEffect(() => {
    isLoadingRef.current = isLoading;
  }, [isLoading]);

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

        let connectionRetryCount = 0;
        const maxRetries = 3;

        const attemptRegister = () => {
          if (wsClient.isConnected()) {
            sendRegisterRequest(formData);
            return;
          }

          if (connectionRetryCount >= maxRetries) {
            setError(
              "Unable to connect to server. Please check your internet connection and try again."
            );
            setIsLoading(false);
            toast({
              variant: "destructive",
              title: "Connection Error",
              description: "Please check your connection and try again.",
            });
            return;
          }

          connectionRetryCount++;

          // Try to force reconnect
          wsClient.forceReconnect();

          setTimeout(() => {
            attemptRegister();
          }, 2000 * connectionRetryCount); // Exponential backoff
        };

        attemptRegister();
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
      const requestId = Math.random().toString(36).substring(7);
      let handleRegisterResponse: (message: any) => void;
      let timeoutId: NodeJS.Timeout;

      handleRegisterResponse = (message: any) => {
        // Handle error responses from WebSocket server
        if (message.type === "error" && message.requestId === requestId) {
          if (timeoutId) {
            clearTimeout(timeoutId);
          }

          setError(message.message || "Registration failed. Please try again.");
          setIsLoading(false);
          wsClient.off("register_response", handleRegisterResponse);
          wsClient.off("error", handleRegisterResponse);

          toast({
            variant: "destructive",
            title: "Registration Failed",
            description:
              message.message || "Registration failed. Please try again.",
          });

          resolve(false);
          return;
        }

        if (
          message.type === "register_response" &&
          message.requestId === requestId
        ) {
          if (timeoutId) {
            clearTimeout(timeoutId);
          }

          if (message.payload?.success) {
            // Registration successful
            tokenStorage.setToken(message.payload.data.token);
            userStorage.setUser(message.payload.data.user);

            setIsLoading(false);
            setError("");

            toast({
              title: "Registration Successful!",
              description: "Welcome! You have been successfully registered.",
            });

            navigate("/games");
            resolve(true);
          } else {
            // Registration failed
            setError(
              message.payload?.message ||
                "Registration failed. Please try again."
            );
            setIsLoading(false);

            toast({
              variant: "destructive",
              title: "Registration Failed",
              description:
                message.payload?.message ||
                "Registration failed. Please try again.",
            });

            resolve(false);
          }

          // Cleanup
          wsClient.off("register_response", handleRegisterResponse);
          wsClient.off("error", handleRegisterResponse);
        }
      };

      // Listen for both response types
      wsClient.on("register_response", handleRegisterResponse);
      wsClient.on("error", handleRegisterResponse);

      // Send register request via WebSocket with salted hash password
      const hashedPassword = hashPassword(formData.password);
      const signedMessage = createSignedMessage(
        MESSAGE_TYPES.REGISTER,
        {
          username: formData.username,
          email: formData.email,
          password: hashedPassword, // Send salted hash instead of plain text
          referralId: formData.referralId,
        },
        requestId
      );

      const success = wsClient.send(signedMessage);

      if (!success) {
        setError(
          "Failed to send registration request. Please check your connection."
        );
        setIsLoading(false);
        wsClient.off("register_response", handleRegisterResponse);
        wsClient.off("error", handleRegisterResponse);

        toast({
          variant: "destructive",
          title: "Connection Error",
          description:
            "Failed to send registration request. Please check your connection.",
        });

        resolve(false);
        return;
      }

      // Timeout after 15 seconds
      timeoutId = setTimeout(() => {
        wsClient.off("register_response", handleRegisterResponse);
        wsClient.off("error", handleRegisterResponse);
        setError("Registration timeout. Please try again.");
        // Use ref to check current loading state instead of stale closure
        if (isLoadingRef.current) {
          setIsLoading(false);
        }

        toast({
          variant: "destructive",
          title: "Request Timeout",
          description: "Registration timed out. Please try again.",
        });

        resolve(false);
      }, 15000);
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
