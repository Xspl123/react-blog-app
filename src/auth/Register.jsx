import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RegisterUser } from "../store/states/blog/BlogReducer";

function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [html, setHtml] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();


  const formSubmit = async (data) => {
    console.log('Form submission data:', data);

    const result = await dispatch(RegisterUser(data));
    console.log(result);
    if (result.payload.status) {
      toast.success('User Added successfully');
      navigate('/login');
    } else {
      toast.error('Failed to add blog');
    }
  };

  return (
    <div className="container mb-4">
      <div className="d-flex justify-content-between pt-5 mb-4">
        <h4>Register hear</h4>
        <a href="/login" className="btn btn-dark">
          Back
        </a>
      </div>

      <div className="card border-0 shadow-lg">
        <div className="card-body">
          <form onSubmit={handleSubmit(formSubmit)}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Name
              </label>
              <input
                {...register('name', { required: true })}
                type="text"
                id="name"
                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                placeholder="Name"
              />
              {errors.name && (
                <p className="invalid-feedback">Name field is required</p>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                {...register('email', { required: true })}
                type="email"
                id="email"
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
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
                {...register('password', { required: true })}
                type="password"
                id="password"
                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                placeholder="Password"
              />
              {errors.password && (
                <p className="invalid-feedback">Password field is required</p>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="password_confirmation" className="form-label">
                Confirm Password
              </label>
              <input
                {...register('password_confirmation', { required: true })}
                type="password"
                id="password_confirmation"
                className={`form-control ${errors.password_confirmation ? 'is-invalid' : ''}`}
                placeholder="Confirm Password"
              />
              {errors.password_confirmation && (
                <p className="invalid-feedback">Password confirmation field is required</p>
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

export default Register;
