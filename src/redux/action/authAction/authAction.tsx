import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  LoginData,
  LoginResponse,
  RefreshTokenPayload,
  RefreshTokenResponse,
  UserDataResponse,
} from "../../../types/authTypes";

// Thunk to handle user login
export const logInUser = createAsyncThunk<UserDataResponse | null, LoginData>(
  "auth/login",
  async (userData, { rejectWithValue }) => {
    try {
      // console.log('Initiating login request with data:', userData);

      const response = await fetch("/admin/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
      console.log('Response login ::::', response)
      if (!response.ok) {
        // Prefer JSON error with a friendly message from the API route
        const contentType = response.headers.get("content-type") || "";
        if (contentType.includes("application/json")) {
          try {
            const j = await response.json();
            return rejectWithValue(j?.message || "Login failed");
          } catch (e) {
            // fallthrough to text
          }
        }
        const txt = await response.text();
        return rejectWithValue(txt && !txt.startsWith("<!DOCTYPE html>") ? txt : "Login failed");
      }

      const result: LoginResponse = await response.json();
      // console.log('Parsed response JSON:', result);

      if (!result.isRequestSuccess) {
        // console.error('API indicates request failure:', result.message);
        return rejectWithValue(result.message || "Request was not successful");
      }

      // console.log('Login successful, returning user data:', result.data);
      return result.data; // Ensure only the `data` field is returned
    } catch (error: any) {
      // console.error('An error occurred during login:', error);

      const errorMessage =
        !window.navigator.onLine || error?.message === "Network Error"
          ? "Network Error"
          : error.message;

      return rejectWithValue(errorMessage);
    }
  }
);

// Thunk to handle get otp history logs
export const getOtpHistoryLogs = createAsyncThunk(
  "auth/getOtpHistoryLogs",
  async (params: { userId: string }, { rejectWithValue }) => {
    try {
      const queryString = new URLSearchParams({ userId: params.userId }).toString();

      const response = await fetch(`/admin/api/auth/getOtpHistoryLogs?${queryString}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      // console.log('Response otp ::::', response)

      if (!response.ok) {
        // If response status is not OK (e.g., 4xx or 5xx)
        const errorData = await response.json();
        return rejectWithValue(errorData.message || "Failed to fetch OTP history logs");
      }

      const data = await response.json();

      // console.log('otp response::', data)

      if (!data || !data.isRequestSuccess) {
        return rejectWithValue(data?.message || "Failed to fetch OTP history logs");
      }

      return data.data;
    } catch (error: any) {
      console.error("Error fetching OTP history logs:", error);

      // Safely return error message for unexpected issues
      return rejectWithValue(
        error.message || "Something went wrong while fetching OTP history logs"
      );
    }
  }
);

// Thunk to handle user Refresh Token
export const userRefreshToken = createAsyncThunk<RefreshTokenResponse, RefreshTokenPayload>(
  "auth/refreshtoken",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await fetch("/admin/api/auth/refreshtoken", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        return rejectWithValue(errorMessage || "Refresh token request failed");
      }

      const result: RefreshTokenResponse = await response.json();

      if (!result.isRequestSuccess) {
        return rejectWithValue(result.message || "Refresh token request was not successful");
      }

      return result; // Ensure the entire result is returned
    } catch (error: any) {
      const errorMessage =
        !window.navigator.onLine || error?.message === "Network Error"
          ? "Network Error"
          : error.message;

      return rejectWithValue(errorMessage);
    }
  }
);