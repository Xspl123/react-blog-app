import { configureStore } from '@reduxjs/toolkit';
import BlogReducer from './states/blog/BlogReducer';
import authReducer from './states/auth/authSlice';

const store = configureStore({
  reducer: {
    blogsData: BlogReducer,
    auth: authReducer,
  },
});

export default store;
