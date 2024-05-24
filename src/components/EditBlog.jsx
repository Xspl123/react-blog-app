import { useEffect, useState } from "react";
import { useNavigate,Link } from "react-router-dom";
import Editor from "react-simple-wysiwyg";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams } from "react-router-dom";
import { rootUrl } from "../ApiRoot";
import { AddImageBlogApi, singlefetchBlogApi, upDateBlogApiData } from "../store/states/blog/BlogReducer";
import { useDispatch} from "react-redux";

function EditBlog() {
  const dispatch = useDispatch();
  const [html, setHtml] = useState("");
  const [imageId, setImageId] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  const { id } = useParams();
  const navigate = useNavigate();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];

    const formData = new FormData();
    formData.append("image", file);

    const result = await dispatch(AddImageBlogApi(formData));

    if (!result?.payload?.status) {
      toast.error(result?.payload?.errors?.image || "Image upload failed");
      e.target.value = null;
    } else {
      const imageId = result?.payload?.image?.name;
      setImageId(imageId);
      setImageUrl(result?.payload?.image?.url);
      toast.success("Image uploaded successfully");
    }
  };

  const onChange = (e) => {
    setHtml(e.target.value);
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const formSubmit = async (data) => {
    data.description = html;
    data.image_id = imageId;

    try {
      const resultAction = await dispatch(upDateBlogApiData({ data, id })).unwrap();
      if (resultAction) {
        toast.success("Blog updated successfully");
        navigate("/blogs");
      }
    } catch (error) {
      toast.error(error.message || "Failed to update blog");
    }
  };

  const fetchBlog = async () => {
    try {
      const res = await dispatch(singlefetchBlogApi(id));
      console.log("d", res);
      if (res?.payload?.success) {
        const blogData = res.payload.blog;
        reset(blogData);
        setHtml(blogData.description || "");
        setImageUrl(blogData.image || null);
      } else {
        toast.error("Failed to fetch blog data");
      }
    } catch (error) {
      console.error("Error fetching the blog:", error);
      toast.error("Error fetching the blog data");
    }
  };

  useEffect(() => {
    fetchBlog();
  }, []);

  return (
    <div className="container mb-4">
      <div className="d-flex justify-content-between pt-5 mb-4">
        <h4>Edit Blog</h4>
        <Link to="/blogs" className="btn btn-dark">
          Back
        </Link>
      </div>

      <div className="card border-0 shadow-lg">
        <div className="card-body">
          <form onSubmit={handleSubmit(formSubmit)}>
            <div className="mb-3">
              <label htmlFor="title" className="form-label">
                Title
              </label>
              <input
                {...register("title", { required: true })}
                type="text"
                id="title"
                className={`form-control ${errors.title ? "is-invalid" : ""}`}
                placeholder="Title"
              />
              {errors.title && (
                <p className="invalid-feedback">Title field is required</p>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="short_desc" className="form-label">
                Short Description
              </label>
              <textarea
                {...register("short_desc")}
                id="short_desc"
                cols="30"
                rows="10"
                className="form-control"
                placeholder="Short Description"
              ></textarea>
            </div>

            <div className="mb-3">
              <label htmlFor="description" className="form-label">
                Description
              </label>
              <Editor
                value={html}
                containerProps={{ style: { height: "400px" } }}
                onChange={onChange}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="image" className="form-label">
                Image
              </label>
              {imageUrl && (
                <div className="mb-3">
                  <img
                    src={`${rootUrl}uploads/blogs/${imageUrl}`}
                    alt="Blog"
                    style={{
                      width: "100%",
                      maxWidth: "500px",
                      height: "auto",
                      maxHeight: "560px",
                      objectFit: "cover",
                    }}
                  />
                </div>
              )}
              <input
                onChange={handleFileChange}
                type="file"
                id="image"
                className="form-control"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="author" className="form-label">
                Author
              </label>
              <input
                {...register("author", { required: true })}
                type="text"
                id="author"
                className={`form-control ${errors.author ? "is-invalid" : ""}`}
                placeholder="Author"
              />
              {errors.author && (
                <p className="invalid-feedback">Author field is required</p>
              )}
            </div>

            <button type="submit" className="btn btn-dark">
              Update
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditBlog;
