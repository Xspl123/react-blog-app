import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "react-toastify/dist/ReactToastify.css";
import IconButton from "@mui/material/IconButton";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ChatIcon from '@mui/icons-material/Chat';

import EditIcon from "@mui/icons-material/Edit";

import {
  fetchBlogApi,
  DeleteBlogApiData,
  SearchBlogApi,
  AddBlogComment,
  fetchBlogComment,
  addLike,
} from "../store/states/blog/BlogReducer";
import { rootUrl } from "../ApiRoot";
import "./Blogs.css";

function Blogs() {
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [comment, setComment] = useState("");
  const [showCommentPopup, setShowCommentPopup] = useState(false);
  const [currentBlogId, setCurrentBlogId] = useState(null);
  const dispatch = useDispatch();
  const blogsData = useSelector((state) => state.blogsData);
  const fetchBlogCommentData = useSelector((state) => state.blogsData);

  const showImage = (img) => {
    return img
      ? `${rootUrl}uploads/blogs/${img}`
      : "https://placehold.co/600x400/EEE/31343C?text=404";
  };

  const confirmDelete = (id) => {
    toast.info(
      <>
        <div>Are you sure you want to delete this blog?</div>
        <button
          onClick={() => handleDelete(id)}
          className="btn btn-danger btn-sm mt-2"
        >
          Confirm
        </button>
      </>,
      {
        position: "top-right",
        autoClose: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
      }
    );
  };

  const handleDelete = async (id) => {
    toast.dismiss();
    setLoading(true);
    try {
      await dispatch(DeleteBlogApiData(id));
      toast.success("Blog deleted successfully");
      dispatch(fetchBlogApi());
    } catch (error) {
      toast.error(`Failed to delete blog: ${error.message || error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const data = {
        title: searchTerm,
      };
      const res = await dispatch(SearchBlogApi(data));
      console.log("Search result:", res);
    } catch (error) {
      console.error("Error searching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCommentClick = (id) => {
    setCurrentBlogId(id);
    setShowCommentPopup(true);
    fetchBlogData();
  };

  const handleCommentSubmit = async () => {
    setLoading(true);
    try {
      const data = {
        blog_id: currentBlogId,
        content: comment,
      };
      const res = await dispatch(AddBlogComment(data));
      if (res.payload.message) {
        dispatch(fetchBlogApi());
        toast.success("Comment added successfully");
      } else {
        toast.error("Failed to add comment");
      }
      setShowCommentPopup(false);
      setComment("");
    } catch (error) {
      toast.error(`Failed to add comment: ${error.message || error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLikeBlog = async (id) => {
    try {
      const result = await dispatch(addLike(id));
      if (addLike.fulfilled.match(result)) {
        toast.success("Liked the blog!");
      } else if (addLike.rejected.match(result)) {
        toast.error(result.payload);
      }
      dispatch(fetchBlogApi()); // Optionally, refresh the blog list to update the like count
    } catch (error) {
      toast.error(`Failed to like blog: ${error.message || error}`);
    }
  };

  const closeCommentPopup = () => {
    setShowCommentPopup(false);
    setComment("");
  };

  const fetchBlogData = async () => {
    const id = currentBlogId;
    await dispatch(fetchBlogComment(id));
  };

  useEffect(() => {
    dispatch(fetchBlogApi());
    fetchBlogData();
  }, [dispatch, currentBlogId]);

  console.log("sss", blogsData.blogsFetchData.blogs);

  return (
    <div className="container">
      <div className="d-flex justify-content-between pt-5 mb-4">
        <h4>Blogs</h4>
        <Link to="/createblog" className="btn btn-dark">
          Create
        </Link>
      </div>

      <div className="d-flex mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search blogs..."
          className="form-control me-2"
        />
        <button onClick={handleSearch} className="btn btn-dark">
          Search
        </button>
      </div>

      <div className="row">
        {loading && <div>Loading...</div>}
        {blogsData?.blogsFetchData?.blogs?.length > 0 &&
          blogsData.blogsFetchData.blogs.map((item, index) => (
            <div className="col-12 col-md-6 col-lg-4 mb-3" key={index}>
              <div className="card border-0 shadow-lg">
                <img
                  src={showImage(item.image)}
                  alt={item.title}
                  style={{
                    width: "100%",
                    height: "auto",
                    maxHeight: "400px",
                    objectFit: "cover",
                  }}
                />
                <div className="card-body">
                  <h4>{item.title}</h4>
                  <p>{item.short_desc}</p>
                </div>
                <div className="d-flex justify-content-between px-3 pb-3">
                  <Link to={`/blog/${item.id}`} className="btn btn-dark py-2">
                    Details
                  </Link>
                  <div className="d-flex align-items-center">
                    <Link
                      to={`/blog/edit/${item.id}`}
                      className="text-dark me-2"
                    >
                      <IconButton>
                        <EditIcon />
                      </IconButton>
                    </Link>
                    <Button
                      onClick={() => confirmDelete(item.id)}
                      className="btn btn-link text-danger me-2 p-0"
                      startIcon={<DeleteIcon />}
                      variant="text"
                      color="inherit"
                    ></Button>
                    <div>
      <span className="commentCountSpan">{item.comment_count}</span>
      <IconButton onClick={() => handleCommentClick(item.id)} color="inherit">
        <ChatIcon />
      </IconButton>
    </div>
                    <IconButton
                      onClick={() => handleLikeBlog(item.id)}
                      color="inherit"
                    >
                      <ThumbUpIcon />
                    </IconButton>
                    <div><span>{item.likes}</span></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>

      {showCommentPopup && (
        <div className="commentPopup">
          <div className="popupContent">
            <button onClick={closeCommentPopup} className="btnClose">
              &times;
            </button>
            <h5>Comments</h5>
            <ul className="commentList">
              {fetchBlogCommentData?.fetchBlogCommentData?.comments.map(
                (comment) => (
                  <li key={comment.id} className="commentCard">
                    <div className="cardContent">
                      <div>
                        <p>{comment.content}</p>
                      </div>
                      <br />
                      <div style={{ float: "left" }}>
                        <p>{comment.formatted_created_at}</p>
                      </div>
                      <div style={{ float: "right" }}>
                        <p>{comment.user_name}</p>
                      </div>
                    </div>
                  </li>
                )
              )}
            </ul>
            <div className="input-group mb-2">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write your comment here..."
                className="form-control"
              />
              <div className="input-group-append">
                <button onClick={handleCommentSubmit} className="iconButton">
                  <i className="fas fa-paper-plane"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Blogs;
