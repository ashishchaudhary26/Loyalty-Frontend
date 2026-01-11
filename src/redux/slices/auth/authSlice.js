import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as authAPI from "./authAPI";

// 🔹 LOGIN
export const login = createAsyncThunk(
  "auth/login",
  async (credentials, thunkAPI) => {
    const data = await authAPI.loginAPI(credentials);
    return data; // expected { accessToken, tokenType, userId, email, role }
  }
);

// 🔹 REGISTER
export const register = createAsyncThunk(
  "auth/register",
  async (payload, thunkAPI) => {
    const data = await authAPI.registerAPI(payload);
    return data;
  }
);

// 🔹 LOAD PROFILE (full profile from backend)
export const loadProfile = createAsyncThunk(
  "auth/loadProfile",
  async (_, thunkAPI) => {
    const data = await authAPI.fetchProfileAPI();
    return data; // { id, email, fullName, mobileNumber, role, isActive, ... }
  }
);

// 🔹 UPDATE PROFILE
export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (payload, thunkAPI) => {
    // payload: { fullName, mobileNumber }
    const data = await authAPI.updateProfileAPI(payload);
    return data; // updated profile object
  }
);

// ✅ Read from localStorage on init
const savedToken = localStorage.getItem("token");
const savedUser = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user"))
  : null;

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: savedToken || null,
    user: savedUser,
    loading: false,
    error: null,
  },
  reducers: {
    logout(state) {
      state.token = null;
      state.user = null;
      state.loading = false;
      state.error = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
  extraReducers: (builder) => {
    builder
      // LOGIN
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;

        // Backend docs:
        // {
        //   "accessToken": "...",
        //   "tokenType": "Bearer",
        //   "userId": 10,
        //   "email": "user@example.com",
        //   "role": "ROLE_CUSTOMER"
        // }

        const accessToken =
          action.payload.accessToken || action.payload.token;

        state.token = accessToken;

        const userObj = {
          id: action.payload.userId,
          email: action.payload.email,
          role: action.payload.role,
        };

        state.user = userObj;

        localStorage.setItem("token", accessToken);
        localStorage.setItem("user", JSON.stringify(userObj));
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Login failed";
      })

      // REGISTER
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false;
        // we can keep user logged out after register; login separately
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Register failed";
      })

      // LOAD PROFILE
      .addCase(loadProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadProfile.fulfilled, (state, action) => {
        state.loading = false;
        // full profile from backend
        state.user = action.payload;
        localStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(loadProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load profile";
      })

      // UPDATE PROFILE
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        localStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update profile";
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
