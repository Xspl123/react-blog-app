import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { apiUrl } from "../../../ApiRoot"; // Replace with your actual API root URL

const initialState = {
  isAuthenticated: !! sessionStorage.getItem("token"),
};

export const loginUser = createAsyncThunk("auth/login", async (data) => {
  try {
    const resp = await axios.post(`${apiUrl}login`, data);
    const token = resp?.data?.token;
    const userName = resp?.data?.user?.name;
    if (token) {
      sessionStorage.setItem("token", token);
    }
    if (userName) {
      sessionStorage.setItem("userName", userName);
    }
    return resp?.data;
  } catch (error) {
    console.error("Login failed", error);
    throw error.response?.data?.message;
  }
});

export const logoutUser = createAsyncThunk("auth/logout", async () => {
  try {
    const token = sessionStorage.getItem("token");
    const userName = sessionStorage.getItem("userName");
    
    
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    // Optionally, you can include the userName in the request or log it
    console.log(`Logging out user: ${userName}`);

    const resp = await axios.post(`${apiUrl}logout`, {}, config);

    sessionStorage.removeItem("token");
    sessionStorage.removeItem("userName");

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