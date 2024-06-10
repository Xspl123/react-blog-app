import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { format } from 'date-fns';
import "@fortawesome/fontawesome-free/css/all.min.css";
import "react-toastify/dist/ReactToastify.css";
import {
  fetchBlogApi,
  DeleteBlogApiData,
  SearchBlogApi,
  AddBlogComment,
  fetchBlogComment,
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

  console.log("sss", fetchBlogCommentData?.fetchBlogCommentData);
  
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
          blogsData?.blogsFetchData?.blogs?.map((item, index) => (
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
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="30"
                        height="30"
                        fill="currentColor"
                        className="bi bi-pencil"
                        viewBox="0 0 16 16"
                      >
                        <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325" />
                      </svg>
                    </Link>
                    <button
                      onClick={() => confirmDelete(item.id)}
                      className="btn btn-link text-danger me-2 p-0"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="30"
                        height="30"
                        fill="currentColor"
                        className="bi bi-trash"
                        viewBox="0 0 16 16"
                      >
                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                        <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                      </svg>
                    </button>
                    <span className="commentCountSpan">
                      {item.comment_count}
                    </span>

                    <button
                      className="btn btn-link text-dark me-2 p-0"
                      onClick={() => handleCommentClick(item.id)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="30"
                        height="30"
                        fill="currentColor"
                        className="bi bi-chat"
                        viewBox="0 0 16 16"
                      >
                        <path d="M2 1a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h2v3l3-3h5a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2H2zm0 1h12a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H7.236a.5.5 0 0 0-.336.13L4 14.292V12.5a.5.5 0 0 0-.5-.5H2a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z" />
                      </svg>
                    </button>
                    <button
                      className="btn btn-link text-dark p-0"
                      onClick={() =>
                        alert("Like functionality not implemented yet")
                      }
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="30"
                        fill="currentColor"
                        className="bi bi-heart"
                        viewBox="0 0 16 16"
                      >
                        <path d="m8 2.748-.717-.737C5.6.281 2.514 3.53 4.048 6.1c1.104 1.888 2.782 3.08 3.954 4.272 1.172-1.193 2.85-2.384 3.954-4.272 1.534-2.569-1.552-5.819-3.235-3.088L8 2.748zm4.002-1.432C12.547.53 15.993 4.021 14.292 7.25 12.2 11.047 8 13.683 8 13.683s-4.2-2.636-6.292-6.433C.007 4.021 3.453.53 7.998 1.316a4.717 4.717 0 0 1 4.004 0z" />
                      </svg>
                    </button>
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
                      
                      <br></br>
                      
                      
                      <div style={{ float:'left' }}>
                      <p>{comment.created_at}</p>
                      </div>
                      <div style={{ float:'right' }}>
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
