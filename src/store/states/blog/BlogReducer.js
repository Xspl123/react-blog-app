import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { apiUrl } from "../../../ApiRoot";

const initialState = {
  blogsFetchData: [],
  singleblogsFetchData: [],
  status: "idle",
  error: null,
};

//Search Blog By Title

// Fetch all blogs
export const SearchBlogApi = createAsyncThunk("blogs/Search", async (data, { rejectWithValue }) => {
  try {
    // Retrieve the token from session storage
    const token = sessionStorage.getItem("token");

    // If the token does not exist, reject the request
    if (!token) {
      return rejectWithValue("No token found in session storage");
    }

    // Configure the request headers
    const config = {
      params: data, 
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    };

    // Make the GET request to the blog search endpoint
    const resp = await axios.get(`${apiUrl}blog/search`, config);
    
    // Return the response data
    return resp?.data;
  } catch (error) {
    console.error("Fetching blogs failed", error);
    
    // If there is an error response, reject with the error message
    if (error.response && error.response.data && error.response.data.message) {
      return rejectWithValue(error.response.data.message);
    }

    // Otherwise, reject with a generic error message
    return rejectWithValue("An error occurred while fetching blogs");
  }
});

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

// Delete blog
export const DeleteBlogApiData = createAsyncThunk(
  "blogs/delete",
  async (id) => {
        try {
      const token = sessionStorage.getItem("token");   
      const resp = await axios.delete(`${apiUrl}blog-delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Accept": "application/json",
        },
      });
      return resp?.data;
    } catch (error) {
      console.error("Blog delete failed", error);
      return error.response?.data?.message;
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

      .addCase(SearchBlogApi.fulfilled, (state, action) => {
        state.blogsFetchData = action.payload;
      })
      
      .addCase(singlefetchBlogApi.fulfilled, (state, action) => {
        state.singleblogsFetchData = action.payload;
      })
   
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
