import React, { useEffect } from "react";
import { fetchBlogApi } from "../store/states/blog/BlogReducer";
import { useDispatch, useSelector } from "react-redux";
import { rootUrl } from "../ApiRoot";
import { Link } from "react-router-dom";
function Blogs() {
  const dispatch = useDispatch();
  const blogsData = useSelector((state) => state.blogsData);

  const showImage = (img) => {
    return img
      ? `${rootUrl}uploads/blogs/${img}`
      : "https://placehold.co/600x400/EEE/31343C?text=404";
  };

  useEffect(() => {
    dispatch(fetchBlogApi());
  }, [dispatch]);

  return (
    <div className="container">
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
