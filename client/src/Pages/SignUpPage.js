import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../API/axiosInstance";

const SignUpPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      const res = await axiosInstance.post(
        `${process.env.REACT_APP_BASE_URL}/auth/signup`,
        {
          email: formData.email,
          password: formData.password,
        }
      );
      if (res.status === 200) {
        alert("Signed Up Successfully");
        navigate(`/`);
      }
    } catch (error) {
      console.error(error);
      if (error.response && error.response.data && error.response.data.error) {
        setErrorMessage(error.response.data.error);
      } else {
        setErrorMessage("An error occurred during sign up.");
      }
    }
  };

  return (
    <>
      <div className="container-fluid min-vh-100">
        <div className="min-vh-100">
          <form
            className="glassomorphic-effect signup-container mx-auto rounded-4"
            onSubmit={handleSubmit}
          >
            <div className="text-center login-text pt-4 mx-auto mb-5">
              <h1 className="mb-3">Sign Up</h1>
            </div>
            <div className="form-container pb-4 mx-auto">
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email address
                </label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  id="email"
                  placeholder="email@gmail.com"
                  required
                  onChange={handleChange}
                  value={formData.email}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <div className="input-group">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    className="form-control"
                    id="password"
                    placeholder="At least 8-20 charac."
                    required
                    onChange={handleChange}
                    value={formData.password}
                  />
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={handleTogglePassword}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
              <div className="mb-3">
                <label htmlFor="confirmPassword" className="form-label">
                  Confirm Password
                </label>
                <div className="input-group">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    className="form-control"
                    id="confirmPassword"
                    placeholder="Confirm your password"
                    required
                    onChange={handleChange}
                    value={formData.confirmPassword}
                  />
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={handleToggleConfirmPassword}
                  >
                    {showConfirmPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
              <span className="text-danger p-2">{errorMessage}</span>
              <br />
              <input
                className="btn px-4 py-2"
                style={{ backgroundColor: "#62c1bf", color: "white" }}
                type="submit"
                value="Sign Up"
              />
            </div>
            <div className="text-center p-3 ">
              <Link className="text-decoration-none blue-text" to="/">
                Already Have An Account ? Login Here
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default SignUpPage;
