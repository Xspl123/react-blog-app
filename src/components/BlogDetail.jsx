import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { rootUrl } from "../ApiRoot";
import { useDispatch } from "react-redux";
import { singlefetchBlogApi } from "../store/states/blog/BlogReducer";
//====================================================================//
const BlogDetail = () => {
  const [blog, setBlog] = useState({});
  const { id } = useParams();
  const dispatch = useDispatch();
  const fetchBlog = async () => {
    try {
      const res = await dispatch(singlefetchBlogApi(id));
      const result = res.payload;
      setBlog(result.blog);
    } catch (error) {
      console.error("Error fetching the blog:", error);
    }
  };
  useEffect(() => {
    fetchBlog();
  }, []);

  return (
    <div>
      <div className="container">
        <div className="d-flex justify-content-between pt-5 mb-4">
          <h2>{blog.title}</h2>
          <div>
            <Link to="/blogs" className="btn btn-dark">
              Back to Blog
            </Link>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <p>
              by <strong>{blog.author}</strong> on {blog.created_at}
            </p>

            {blog.image && (
              <img
                style={{
                  width: "100%",
                  maxWidth: "500px",
                  height: "auto",
                  maxHeight: "560px",
                  objectFit: "cover",
                }}
                src={`${rootUrl}uploads/blogs/${blog.image}`}
                alt="image"
              />
            )}
          </div>
        </div>
        <div className="row">
          <div
            className="col-12 py-5 w-50"
            dangerouslySetInnerHTML={{ __html: blog.description }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
