// authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  UserDataResponse,
  RoleAndAction,
  OtpHistoryItem,
  OtpHistoryData,
  RefreshTokenResponse,
} from "../../../types/authTypes";
import {
  logInUser,
  getOtpHistoryLogs,
  userRefreshToken,
} from "../../action/authAction/authAction";
import { deleteCookie, setCookie } from "cookies-next";
import toast from "react-hot-toast";

// Define the initial state for the authentication slice
interface AuthState {
  user: UserDataResponse | null;
  authToken: string | undefined;
  refreshToken: string | undefined;
  userType: string | undefined;
  role: string | undefined;
  apiActions: [] | null;
  roleAndActions: RoleAndAction[] | null;
  otpHistory: OtpHistoryData | null;
  otpHistoryData: OtpHistoryItem[] | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  authToken: undefined,
  refreshToken: undefined,
  userType: undefined,
  role: undefined,
  apiActions: null,
  roleAndActions: null,
  otpHistory: null,
  otpHistoryData: null,
  loading: false,
  error: null,
};

// Create the authentication slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logOutUser: (state) => {
      console.log("Logging out user");
      state.user = null;
      deleteCookie("UserAuthenticated");
      deleteCookie("AuthToken");
      deleteCookie("RefreshToken");
      deleteCookie("user_object");
      console.log("User logged out, reloading window");
      // Clear browser storage so nothing remains after logout
      try {
        if (typeof window !== 'undefined') {
          try { localStorage.removeItem('sessionId'); } catch {}
          try { localStorage.removeItem('token'); } catch {}
          try { localStorage.removeItem('role'); } catch {}
          try { localStorage.removeItem('allowed_tables'); } catch {}
          try { localStorage.removeItem('allowed_routes'); } catch {}
          // Clear persisted Redux state if present
          try { localStorage.removeItem('persist:root'); } catch {}
          try { sessionStorage.clear(); } catch {}
        }
      } catch {}
      window.location.reload();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(logInUser.pending, (state) => {
        console.log("Login request is pending");
        state.loading = true;
        state.error = null;
      })
      .addCase(
        logInUser.fulfilled,
        (state, action: PayloadAction<UserDataResponse | null>) => {
          if (action.payload) {
            state.user = action.payload;
            // Map new backend fields safely
            state.authToken = action.payload.token;
            state.refreshToken = action.payload.refreshToken;
            state.userType = action.payload.userType || action.payload.role; // fallback
            state.role = action.payload.role;
            // Legacy fields may not exist with new backend; clear them to avoid stale state
            state.roleAndActions = action.payload.roleAndActions || null;
            state.apiActions = null;

            if (action.payload.token) {
              setCookie("AuthToken", action.payload.token);
            }
            if (action.payload.refreshToken) {
              setCookie("RefreshToken", action.payload.refreshToken);
            }
            setCookie("user_object", JSON.stringify(action.payload));
            setCookie("UserAuthenticated", true);

            try {
              if (typeof window !== 'undefined') {
                if (action.payload.sessionId) {
                  localStorage.setItem('sessionId', String(action.payload.sessionId));
                }
                if (action.payload.token) {
                  localStorage.setItem('token', String(action.payload.token));
                }
                if (action.payload.role) {
                  localStorage.setItem('role', String(action.payload.role));
                }
                if ((action.payload as any).user) {
                  try { localStorage.setItem('user', JSON.stringify((action.payload as any).user)); } catch {}
                }
                if (action.payload.allowed_tables) {
                  localStorage.setItem('allowed_tables', JSON.stringify(action.payload.allowed_tables));
                }
                if (action.payload.allowed_routes) {
                  localStorage.setItem('allowed_routes', JSON.stringify(action.payload.allowed_routes));
                }
              }
            } catch {}
          } else {
            console.error("Login request fulfilled, but no user data received");
          }
          state.loading = false;
          state.error = null;
        }
      )
      .addCase(logInUser.rejected, (state, action: any) => {
        console.log("Login request rejected with error:", action.payload);
        toast.error(action.payload)
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getOtpHistoryLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getOtpHistoryLogs.fulfilled,
        (state, action: PayloadAction<OtpHistoryData | null>) => {
          console.log("API Response:", action.payload); // Debugging response
          console.log("ACTION DATA", action.payload);
          if (action.payload && action.payload) {
            console.log("Extracted History:", action.payload.history); // Debug history
            state.otpHistory = action.payload;
            state.otpHistoryData = action.payload.history || [];
          } else {
            console.warn("No data field in the payload");
            state.otpHistory = null;
            state.otpHistoryData = [];
          }
          state.loading = false;
          state.error = null;
        }
      )
      .addCase(getOtpHistoryLogs.rejected, (state, action: any) => {
        // toast.error(action.payload)
        state.loading = false;
        state.error = action.payload as string;
      })

      // Note: Refresh Token 
      .addCase(userRefreshToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userRefreshToken.fulfilled, (state, action: PayloadAction<RefreshTokenResponse | null>) => {
        console.log("userRefreshToken.fulfilled", action.payload);

        state.loading = false;
      })
      .addCase(userRefreshToken.rejected, (state, action: PayloadAction<any>) => {
        // toast.error(action.payload)
        state.loading = false;
        state.error = action.payload as string;
      })
  },
});

// Export actions and reducer
export const { logOutUser } = authSlice.actions;
export default authSlice.reducer;
