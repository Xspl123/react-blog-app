import React, { useEffect, useState } from "react";
import { fetchBlogApi, DeleteBlogApiData } from "../store/states/blog/BlogReducer";
import { useDispatch, useSelector } from "react-redux";
import { rootUrl } from "../ApiRoot";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Blogs() {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const blogsData = useSelector((state) => state.blogsData);

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

  useEffect(() => {
    dispatch(fetchBlogApi());
  }, [dispatch]);

  return (
    <div className="container">
      <ToastContainer />
      <div className="d-flex justify-content-between pt-5 mb-4">
        <h4>Blogs</h4>
        <Link to="/createblog" className="btn btn-dark">
          Create
        </Link>
      </div>

      <div className="row">
        {blogsData?.blogsFetchData?.blogs?.length > 0 &&
          blogsData?.blogsFetchData?.blogs?.map((item, index) => (
            <React.Fragment key={index}>
              <div className="col-12 col-md-6 col-lg-4 mb-3">
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
                    <div>
                      <Link to={`/blog/edit/${item.id}`} className="text-dark">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-pencil"
                          viewBox="0 0 16 16"
                        >
                          <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325" />
                        </svg>
                      </Link>

                      <button
                        onClick={() => confirmDelete(item.id)}
                        className="btn btn-link text-danger ms-2 p-0"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-trash"
                          viewBox="0 0 16 16"
                        >
                          <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                          <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </React.Fragment>
          ))}
      </div>
    </div>
  );
}

export default Blogs;
