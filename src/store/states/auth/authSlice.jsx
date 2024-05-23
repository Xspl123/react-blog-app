import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { apiUrl } from "../../../ApiRoot";

const initialState = {
  isAuthenticated: !!sessionStorage.getItem("token"),
};

export const loginUser = createAsyncThunk("auth/login", async (data) => {
  try {
    const resp = await axios.post(`${apiUrl}login`, data);
    const token = resp?.data?.token;
    if (token) {
      sessionStorage.setItem("token", token);
    }
    return resp?.data;
  } catch (error) {
    console.error("Login failed", error);
    throw error.response?.data?.message;
  }
});

// // Logout a user
export const logoutUser = createAsyncThunk("auth/logout", async () => {
  try {
    const token = sessionStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
    const resp = await axios.post(`${apiUrl}logout`, {}, config);
    sessionStorage.removeItem("token");
    return resp?.data;
  } catch (error) {
    console.error("Logout failed", error);
    throw error.response?.data?.message;
  }
});
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state) => {
        state.isAuthenticated = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuthenticated = false;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
