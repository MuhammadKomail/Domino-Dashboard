import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import { getCookie, setCookie, deleteCookie } from "cookies-next";
import { cookies } from "next/headers";
import toast from "react-hot-toast";

const axiosInstance: AxiosInstance = axios.create({
  // baseURL: `http://${process.env.NEXT_PUBLIC_API_URL}`,
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  // timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Authorization: "",
  },
});

// Minimal interface for user_object
interface UserObject {
  token: string;
  refreshToken: string;
  [key: string]: any;
}

// Helper function for managing user_object
const getUserObject = async (): Promise<UserObject | null> => {
  const userObjectRaw = await getCookie("user_object", { cookies });
  return userObjectRaw ? JSON.parse(String(userObjectRaw)) : null;
};

const saveUserObject = (userObject: UserObject) => {
  const userObjectString = JSON.stringify(userObject);
  setCookie("user_object", userObjectString, { cookies });
};

// Function to refresh tokens
const refreshAuthToken = async (): Promise<boolean> => {
  try {
    const userObject = await getUserObject();

    if (!userObject || !userObject.refreshToken || !userObject.token) {
      console.warn("[Token Refresh] Missing user_object, refreshToken, or token.");
      return false;
    }

    console.log("[Token Refresh] Current Refresh Token:", userObject.refreshToken ? "**exists**" : "missing");
    console.log("[Token Refresh] Current Access Token:", userObject.token ? "**exists**" : "missing");

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/Auth/IAuthFeature/RefreshToken`,
      { accessToken: userObject.token, refreshToken: userObject.refreshToken },
      { headers: { "Content-Type": "application/json" } }
    );

    console.log("[Token Refresh] Response status:", response.status);
    console.log("[Token Refresh] Response structure:", JSON.stringify({
      isApiHandled: response.data.isApiHandled,
      isRequestSuccess: response.data.isRequestSuccess,
      statusCode: response.data.statusCode,
      message: response.data.message,
      hasData: !!response.data.data,
      dataKeys: response.data.data ? Object.keys(response.data.data) : []
    }));

    if (response.status === 200 && response.data && response.data.data) {
      const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data.data;

      if (newAccessToken && newRefreshToken) {
        userObject.token = newAccessToken;
        userObject.refreshToken = newRefreshToken;
        saveUserObject(userObject);

        console.log("[Token Refresh] Tokens refreshed successfully.");
        return true;
      } else {
        console.warn("[Token Refresh] Missing new tokens in response data:",
          "accessToken:", !!newAccessToken,
          "refreshToken:", !!newRefreshToken);
      }
    } else {
      console.warn("[Token Refresh] Unexpected response structure:",
        "status:", response.status,
        "hasData:", !!response.data,
        "hasNestedData:", !!(response.data && response.data.data));
    }
  } catch (error: any) {
    console.error("[Token Refresh] Failed to refresh tokens:", error.message);
    if (error.response) {
      console.error("[Token Refresh] Error response:", {
        status: error.response.status,
        data: error.response.data,
      });
    }
  }
  return false;
};

// Request interceptor
axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const userObject = await getUserObject();
    if (userObject?.token) {
      config.headers.Authorization = `Bearer ${userObject.token}`;
    }
    return config;
  },
  (error: AxiosError): Promise<AxiosError> => {
    console.error("[API Request] Request error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Handle 401 errors
    if (error.response?.status === 401) {
      // If this is a refresh token request that failed with 401, logout silently
      if (originalRequest.url?.includes('/Auth/IAuthFeature/RefreshToken')) {
        toast.error('Session expired. Please login again.');
        console.warn('[API Response] Refresh token request failed with 401. Logging out.');
        deleteCookie('user_object', { cookies });
        deleteCookie('AuthToken', { cookies });
        deleteCookie('RefreshToken', { cookies });
        deleteCookie('UserAuthenticated', { cookies });
        if (typeof window !== 'undefined') {
          window.location.href = '/admin/login';
        }
        // Return a resolved promise to suppress error propagation
        return Promise.resolve();
      }

      // For other 401 errors, try to refresh the token once
      if (!originalRequest._retry) {
        originalRequest._retry = true;
        console.log('[API Response] Attempting to refresh token...');

        try {
          const refreshed = await refreshAuthToken();

          if (refreshed) {
            const userObject = await getUserObject();
            if (userObject?.token) {
              originalRequest.headers.Authorization = `Bearer ${userObject.token}`;
              return axiosInstance(originalRequest);
            }
          }

          // If refresh failed, logout silently
          console.warn('[API Response] Token refresh failed. Logging out.');
          deleteCookie('user_object', { cookies });
          deleteCookie('AuthToken', { cookies });
          deleteCookie('RefreshToken', { cookies });
          deleteCookie('UserAuthenticated', { cookies });
          if (typeof window !== 'undefined') {
            window.location.href = '/admin/login';
          }
          // Return a resolved promise to suppress error propagation
          return Promise.resolve();
        } catch (refreshError) {
          console.error('[API Response] Token refresh error:', refreshError);
          deleteCookie('user_object', { cookies });
          deleteCookie('AuthToken', { cookies });
          deleteCookie('RefreshToken', { cookies });
          deleteCookie('UserAuthenticated', { cookies });
          if (typeof window !== 'undefined') {
            window.location.href = '/admin/login';
          }
          // Return a resolved promise to suppress error propagation
          return Promise.resolve();
        }
      }
    }

    // For non-401 errors, propagate the error as usual
    console.error('[API Response] Response error:', error);
    return Promise.reject(error);
  }
);

export default axiosInstance;