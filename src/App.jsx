import "bootstrap/dist/css/bootstrap.min.css";
import { Route, Routes, Link } from "react-router-dom";
import Blogs from "./components/Blogs";
import { useState } from "react";
import CreateBlog from "./components/CreateBlog";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BlogDetail from "./components/BlogDetail";
import EditBlog from "./components/EditBlog";
import Login from "./auth/Login";
import Register from "./auth/Register";
import { FiLogOut } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "./store/states/auth/authSlice";
import PrivateRoute from "./components/PrivateRoute";
import Random from "./components/Random";
import PhotoGallery from "./components/PhotoGallery";

function App() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const userName = sessionStorage.getItem("userName");
  const [isHovered, setIsHovered] = useState(false);
  const dispatch = useDispatch();
  
  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  const handleLogout = () => {
    dispatch(logoutUser())
      .unwrap()
      .then(() => {
        toast.success("Successfully logged out!");
      })
      .catch((error) => {
        toast.error("Logout failed!");
        console.error("Logout failed", error);
      });
  };

  return (
    <>
      <div className="bg-dark text-center py-2 shadow-lg">
        <ul className="nav d-flex bd-highlight mb-3">
          {!isAuthenticated && (
            <>
              <li className="nav-item">
                <Link to="/login" className="nav-link text-white">
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/register" className="nav-link text-white">
                  Register
                </Link>
              </li>
            </>
          )}
          {isAuthenticated && (
            <>
            
            <li className="nav-item ml-auto me-auto p-2 bd-highlight">
                <Link to="/photo-gallery" className="nav-link text-white">
                  Photo Gallery
                </Link>
              </li>

              <li className="nav-item ml-auto text-white text-end p-2 bd-highlight">
                <h6 style={{ paddingTop: "11px" }}>Welcome To {userName}</h6>
              </li>
              <li className="nav-item ml-auto p-2 bd-highlight">
                <Link
                  to="/"
                  className="nav-link text-white"
                  onClick={handleLogout}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <FiLogOut /> {/* This will render the log out icon */}
                  {isHovered && (
                    <span style={{ marginLeft: "5px" }}>Log Out</span>
                  )}
                </Link>
              </li>
              
            </>
            
          )}
        </ul>
      </div>

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/photo-gallery" element={
          <PrivateRoute>
          <PhotoGallery />
        </PrivateRoute>
        } />
        
        <Route
          path="/blogs"
          element={
            <PrivateRoute>
              <Blogs />
            </PrivateRoute>
          }
        />
        <Route
          path="/createblog"
          element={
            <PrivateRoute>
              <CreateBlog />
            </PrivateRoute>
          }
        />
        <Route
          path="/blog/:id"
          element={
            <PrivateRoute>
              <BlogDetail />
            </PrivateRoute>
          }
        />
        <Route
          path="/blog/edit/:id"
          element={
            <PrivateRoute>
              <EditBlog />
            </PrivateRoute>
          }
        />

        <Route path="*" element={<Login />} />
      </Routes>

      <ToastContainer />
    </>
  );
}

export default App;
