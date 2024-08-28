import React, { useState } from "react";
import { Button, Form, Alert } from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./Login.css";
import { Navigate, useNavigate } from "react-router-dom";
import APIs, { authApi, endpoints } from "../../../configs/APIs";
import "bootstrap/dist/css/bootstrap.min.css";
import "../User.css"

const Login = () => {
  const [user, setUser] = useState({});
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState("");
  const [isInfoEntered, setIsInfoEntered] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fields = [
    {
      label: "Tên đăng nhập",
      icon: "account",
      name: "username",
    },
    {
      label: "Mật khẩu",
      icon: !visible ? "eye-off" : "eye",
      name: "password",
      type: visible ? "text" : "password",
    },
  ];

  const updateState = (field, value) => {
    setUser((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      login();
    }
  };

  const onFieldChange = (field, value) => {
    updateState(field, value);
    setIsInfoEntered(fields.every((field) => user[field.name]?.trim() !== ""));
  };

  const login = async () => {
    setLoading(true);

    try {
      if (!isInfoEntered) {
        throw new Error("Vui lòng nhập đầy đủ thông tin đăng nhập!");
      }

      const response = await APIs.post(endpoints.login, {
        ...user,
        client_id: "jzEQTDJqG0KWm8taVGLhZNKaUku6U2pvUvZDs5ue",
        client_secret:
          "wfnse8NMa0Zho0GooT7UuzymJMXRwx0Zr2dvAjp8e6ogBGCxxbq2OiTmKs8a0vzDYAoixyW7EVJbqXoRDI3oG7aDDAF1UnwAtfkkRoL9TsNlCywvRMZ9QSVc3IGGkHJO",
        grant_type: "password",
      });

      const token = response.data.access_token;
      localStorage.setItem("token", token);

      const userResponse = await authApi(token).get(endpoints.currentUser);

      navigate("/");
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);

      setError(
        error.response && error.response.data
          ? "Tên đăng nhập hoặc mật khẩu không đúng!"
          : "Vui lòng nhập đầy đủ thông tin đăng nhập"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="app-container">
        <div className="user-container">
          <div className="user-image">
            <img
              src="https://res.cloudinary.com/dkmurrwq5/image/upload/v1724688828/nen.png"
              alt="Login"
              className="image"
            />
          </div>

          <div className="user-form-container">
            <div className="user-form">
              <h2 className="text-center">Đăng nhập</h2>

              <Form>
                {fields.map((field) => (
                  <Form.Group
                    controlId={field.name}
                    key={field.name}
                    className={
                      field.name === "password" ? "password-container" : ""
                    }
                  >
                    <Form.Control
                      type={field.type || "text"}
                      placeholder={field.label}
                      className="input-textbox"
                      onChange={(e) =>
                        onFieldChange(field.name, e.target.value)
                      }
                      onKeyDown={handleKeyDown}
                    />

                    {field.name === "password" && (
                      <Button
                        variant="link"
                        className="password-toggle"
                        onClick={() => setVisible(!visible)}
                      >
                        {visible ? <FaEyeSlash /> : <FaEye />}
                      </Button>
                    )}
                  </Form.Group>
                ))}
                {error && (
                  <Alert className="text-center" variant="danger">
                    {error}
                  </Alert>
                )}
                <Button
                  variant="primary"
                  type="button"
                  className="w-100 user-btn"
                  onClick={login}
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Đăng Nhập"}
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

              <div className="change-account text-center">
                <p>Chưa có tài khoản?</p>
                <a href="/register">
                  <i>Đăng ký.</i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
