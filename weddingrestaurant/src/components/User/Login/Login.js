import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Email:", email);
    console.log("Password:", password);
  };

  return (
    <div className="app-container">
      <div className="login-container">
        <div className="login-image">
          <img
            src="https://res.cloudinary.com/dkmurrwq5/image/upload/v1724688828/nen.png"
            alt="Login"
            className="image"
          />
        </div>

        <div className="login-form-container">
          <div className="login-form">
            <h2>Đăng nhập</h2>

            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="username">
                <Form.Control
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Nhập username..."
                  required
                />
              </Form.Group>
              <Form.Group controlId="password">
              <div className="password-container">
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Nhập mật khẩu..."
                    required
                  />
                  <Button
                    variant="link"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </Button>
                </div>
              </Form.Group>
              <Button variant="primary" type="submit" className="w-100">
                Đăng nhập
              </Button>
            </Form>

            <div className="social-login mt-3">
              <Button variant="outline-dark" className="me-2">
                <img
                  src="https://res.cloudinary.com/dkmurrwq5/image/upload/v1724739568/google_icon.png"
                  alt="Google"
                  className="social-icon"
                />
              </Button>
              <Button variant="outline-dark">
                <img
                  src="https://res.cloudinary.com/dkmurrwq5/image/upload/v1724739568/facebook_icon.png"
                  alt="Facebook"
                  className="social-icon"
                />
              </Button>
            </div>

            <div className="forgot-password text-center">
              <a href="/forgot-password">
                <i>Quên mật khẩu?</i>
              </a>
            </div>

            <div className="create-account text-center">
              <a href="/register">
                <i>Tạo tài khoản mới</i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
