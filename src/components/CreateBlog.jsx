import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Editor from "react-simple-wysiwyg";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  AddBlogApiData,
  AddImageBlogApi,
} from "../store/states/blog/BlogReducer";
import { useDispatch } from "react-redux";

function CreateBlog() {
  const [html, setHtml] = useState("");
  const [ImageId, setImageId] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await dispatch(AddImageBlogApi(formData));
      console.log(res);
      if (!res?.payload?.status) {
        const result = res.payload;
        if (result && result.errors && result.errors.image) {
          toast.error(result.errors.image);
        } else {
          toast.error("An error occurred while uploading the image.");
        }
        e.target.value = null;
      } else {
        const result = res.payload;
        const imageId = result.image.name;
        setImageId(imageId);
        toast.success("Image uploaded successfully.");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      toast.error("An error occurred while uploading the image.");
      e.target.value = null;
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const formSubmit = async (data) => {
    data.description = html;
    data.image_id = ImageId;

    console.log("Form submission data:", data);

    try {
      const res = await dispatch(AddBlogApiData(data));
      console.log(res);

      if (res?.payload?.status) {
        toast.success("Blog added successfully");
        navigate("/blogs");
      } else {
        toast.error(res.payload?.message || "Failed to add blog");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      toast.error("An error occurred while adding the blog.");
    }
  };
  return (
    <div className="container mb-4">
      <div className="d-flex justify-content-between pt-5 mb-4">
        <h4>Create Blog</h4>
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
                onChange={(e) => setHtml(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="image" className="form-label">
                Image
              </label>
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
              Create
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateBlog;
