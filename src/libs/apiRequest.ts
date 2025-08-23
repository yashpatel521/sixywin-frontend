// apiRequest.ts
import axios from "axios";
import { useState, useCallback } from "react";
import { API_URL } from "./constants";
import { getUserProfile } from "@/utils/storage";

interface ApiRequestProps {
  url: string;
  data?: unknown;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  isToken?: boolean;
  params?: Record<string, any>;
}

interface ApiResponse<T = unknown> {
  loading: boolean;
  success: boolean | null;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  data: T | null | any;
  error: string | null;
  message: string | null;
  request: () => Promise<void>;
}

interface BackendResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
}

export function useApiRequest<T = unknown>({
  url,
  data = {},
  method = "POST",
  isToken = false,
  params = {},
}: ApiRequestProps): ApiResponse<T> {
  const [loading, setLoading] = useState(false);
  const [responseData, setResponseData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean | null>(null);

  const request = useCallback(async () => {
    setLoading(true);
    setError(null);
    setMessage(null);
    setSuccess(null);

    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (isToken) {
        const userProfile = getUserProfile();
        const token = userProfile?.token;
        if (token) headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await axios.request<BackendResponse<T>>({
        url: API_URL + url,
        method,
        data,
        params,
        headers,
      });

      const { success, message, data: responseDataValue } = res.data;

      setResponseData(responseDataValue);
      setMessage(message);
      setSuccess(success);
    } catch (err: unknown) {
      let errorMessage = "Something went wrong";

      if (axios.isAxiosError(err)) {
        errorMessage = err.response?.data?.message || err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  }, [url, data, method, isToken, params]);

  return {
    loading,
    success,
    data: responseData,
    error,
    message,
    request,
  };
}
