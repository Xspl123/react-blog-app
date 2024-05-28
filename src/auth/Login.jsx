import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../store/states/auth/authSlice';

function Login() {
  const [apiError, setApiError] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const formSubmit = async (data) => {
    try {
      const result = await  dispatch(loginUser(data))
      if (result.payload) {
        toast.success('User login successfully');
        navigate('/blogs');
      } else {
        setApiError(result.error.message);
        toast.error(result.error.message);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'An error occurred';
      setApiError(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <div className="container mb-4">
      <div className="d-flex justify-content-between pt-5 mb-4">
        <h4>Login here</h4>
        <a href="/register" className="btn btn-dark">
          Back
        </a>
      </div>

      <div className="card border-0 shadow-lg">
        <div className="card-body">
          {apiError && <div className="alert alert-danger">{apiError}</div>}
          <form onSubmit={handleSubmit(formSubmit)}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                {...register("email", { required: true })}
                type="email"
                id="email"
                className={`form-control ${errors.email ? "is-invalid" : ""}`}
                placeholder="Email"
              />
              {errors.email && (
                <p className="invalid-feedback">Email field is required</p>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                {...register("password", { required: true })}
                type="password"
                id="password"
                className={`form-control ${errors.password ? "is-invalid" : ""}`}
                placeholder="Password"
              />
              {errors.password && (
                <p className="invalid-feedback">Password field is required</p>
              )}
            </div>
            <button type="submit" className="btn btn-dark">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
