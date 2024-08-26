import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { FaGoogle, FaFacebookF } from "react-icons/fa";
import "./Login.css"; // Import CSS tùy chỉnh

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
                <Form.Control
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập mật khẩu..."
                  required
                />
              </Form.Group>
              <Button variant="primary" type="submit" className="w-100">
                Đăng nhập
              </Button>
            </Form>

            <div className="social-login mt-3">
              <Button variant="outline-dark" className="me-2">
                <FaGoogle />
              </Button>
              <Button variant="outline-dark">
                <FaFacebookF />
              </Button>
            </div>
            <div className="mt-3 text-center">
              <a href="/register">
                <i>Đăng ký</i>
              </a>{" "}
              /{" "}
              <a href="/forgot-password">
                <i>Quên mật khẩu?</i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
