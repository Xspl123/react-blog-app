import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { apiUrl } from "../../../ApiRoot";

const initialState = {
  blogsFetchData: [],
  singleblogsFetchData: [],
  status: "idle",
  error: null,
};

// Fetch all blogs
export const fetchBlogApi = createAsyncThunk("blogs/fetchAll", async () => {
  try {
    const token = sessionStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
    const resp = await axios.get(`${apiUrl}blogs-list`, config);
    return resp?.data;
  } catch (error) {
    console.error("Fetching blogs failed", error);
    throw error.response?.data?.message;
  }
});

// Fetch a single blog by ID
export const singlefetchBlogApi = createAsyncThunk(
  "blogs/fetchSingle",
  async (id) => {
    try {
      const token = sessionStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };
      const resp = await axios.get(`${apiUrl}single-blog-list/${id}`,config);
      return resp?.data;
    } catch (error) {
      console.error("Fetching single blog failed", error);
      throw error.response?.data?.message;
    }
  }
);

// Add image to blog
export const AddImageBlogApi = createAsyncThunk(
  "blogs/addImage",
  async (formData) => {
    try {
      const token = sessionStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };
      const resp = await axios.post(`${apiUrl}image-upload/`, formData, config);
      return resp?.data;
    } catch (error) {
      console.error("Image upload failed", error);
      throw error.response?.data?.message;
    }
  }
);

// Create a new blog
export const AddBlogApiData = createAsyncThunk("blogs/add", async (data) => {
  try {
    const token = sessionStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
    const resp = await axios.post(`${apiUrl}create-blog`, data, config);
    return resp?.data;
  } catch (error) {
    console.error("Blog creation failed", error);
    throw error.response?.data?.message;
  }
});

// Register a new user
export const RegisterUser = createAsyncThunk("auth/register", async (data) => {
  try {
    const resp = await axios.post(`${apiUrl}register`, data);
    return resp?.data;
  } catch (error) {
    console.error("Registration failed", error);
    throw error.response?.data?.message;
  }
});

// // Login a user
// export const LoginUser = createAsyncThunk("auth/login", async (data) => {
//   try {
//     const resp = await axios.post(`${apiUrl}login`, data);
//     const token = resp?.data?.token;
//     if (token) {
//       sessionStorage.setItem("token", token);
//     }
//     return resp?.data;
//   } catch (error) {
//     console.error("Login failed", error);
//     throw error.response?.data?.message
//   }
// });

// // Logout a user
// export const logOutUser = createAsyncThunk("auth/logout", async () => {
//   try {
//     const token = sessionStorage.getItem("token");
//     const config = {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json",
//       },
//     };
//     const resp = await axios.post(`${apiUrl}logout`, {}, config);
//     sessionStorage.removeItem("token");
//     return resp?.data;
//   } catch (error) {
//     console.error("Logout failed", error);
//     throw error.response?.data?.message;
//   }
// });

// Update blog
export const upDateBlogApiData = createAsyncThunk(
  "blogs/update",
  async ({ data, id }) => {
    try {
      const token = sessionStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };
      const resp = await axios.post(`${apiUrl}updateBlog/${id}`, data, config);
      return resp?.data;
    } catch (error) {
      console.error("Blog update failed", error);
      throw error.response?.data?.message;
    }
  }
);

const Blogs = createSlice({
  name: "blogs",
  initialState,
  reducers: {
    FormData: (state, action) => {
      const { prop, value } = action.payload;
      state[prop] = value;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlogApi.fulfilled, (state, action) => {
        state.blogsFetchData = action.payload;
      })
      .addCase(singlefetchBlogApi.fulfilled, (state, action) => {
        state.singleblogsFetchData = action.payload;
      })
      // .addCase(logOutUser.fulfilled, (state) => {
      //   state.blogsFetchData = [];
      //   state.singleblogsFetchData = [];
      //   state.status = "idle";
      // })
      .addMatcher(
        (action) => action.type.endsWith("/pending"),
        (state) => {
          state.status = "loading";
        }
      )
      .addMatcher(
        (action) => action.type.endsWith("/fulfilled"),
        (state) => {
          state.status = "succeeded";
        }
      )
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, action) => {
          state.status = "failed";
          state.error = action.error.message;
        }
      );
  },
});

export const { FormData } = Blogs.actions;
export default Blogs.reducer;
