import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Register.css";
import gymBackground from "../../assets/img/gym-background.jpg";
import { registerUser } from "../../services/apiUser";

export default function Register() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    terms: false,
  });
  const [error, setError] = useState("");

  const getPasswordStrength = () => {
    let strength = 0;
    if (password.length > 5) strength++;
    if (password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^a-zA-Z0-9]/)) strength++;
    return strength;
  };

  const strength = getPasswordStrength();

  const handleInputChange = (e) => {
    const { id, value, checked, type } = e.target;
    setFormData({
      ...formData,
      [id]: type === "checkbox" ? checked : value,
    });
    if (id === "password") {
      setPassword(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submit button clicked, initiating registration...");
    setError("");

    if (!formData.terms) {
      setError("Please agree to the Privacy Policy.");
      return;
    }

    try {
      const data = await registerUser({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
      console.log("Response:", data);
      if (!data.user) {
        throw new Error(data.message || "Registration failed.");
      }

      alert("Registration successful! Please log in.");
      window.location.href = "/auth/login";
    } catch (error) {
      console.error("Registration Error:", error);
      setError(error.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <div className="login-form register-form">
          <h2 className="login-title register-title">Register</h2>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="label" htmlFor="username">
                Username
              </label>
              <input
                type="text"
                id="username"
                className="input"
                placeholder="Username"
                value={formData.username}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="label" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="input"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="label" htmlFor="password">
                Password
              </label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className="input"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  👁
                </button>
              </div>
              <div className={`password-strength strength-${strength}`}>
                <div className="strength-bars">
                  <div className="strength-bar"></div>
                  <div className="strength-bar"></div>
                  <div className="strength-bar"></div>
                  <div className="strength-bar"></div>
                </div>
                <div className="strength-text">
                  {["Weak", "Fair", "Good", "Strong"][strength - 1] || "Too short"}
                </div>
              </div>
            </div>
            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  id="terms"
                  className="checkbox"
                  checked={formData.terms}
                  onChange={handleInputChange}
                  required
                />
                <span className="checkbox-text">
                  I agree to the{" "}
                  <Link to="#" className="policy-link">
                    Privacy Policy
                  </Link>
                </span>
              </label>
            </div>
            <button type="submit" className="submit-btn">
              REGISTER
            </button>
          </form>
          <div className="links">
            <Link to="/auth/login" className="link">
              Already have an account?
            </Link>
            <Link to="/auth/forget" className="link">
              Forgot password?
            </Link>
          </div>
        </div>
        <div className="image-section">
          <img src={gymBackground} alt="Gym Background" className="gym-image" />
        </div>
      </div>
    </div>
  );
}