import { FaEye, FaEyeSlash } from "react-icons/fa";
import React, { useState } from "react";
import { Alert, Button, Form, Spinner } from "react-bootstrap";
import "../User.css";
import "../Register/Register.css";
import APIs, { endpoints } from "../../../configs/APIs";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [visible, setVisible] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [user, setUser] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    phone: "",
    password: "",
  });

  const fields = [
    {
      label: "Tên và họ lót",
      name: "last_name",
    },
    {
      label: "Tên",
      name: "first_name",
    },
    {
      label: "Tên đăng nhập",
      name: "username",
    },
    {
      label: "Email",
      name: "email",
    },
    {
      label: "Số điện thoại",
      name: "phone",
    },
    {
      label: "Mật khẩu",
      secureTextEntry: true,
      name: "password",
    },
    {
      label: "Xác nhận mật khẩu",
      secureTextEntry: true,
      name: "confirm",
    },
  ];

  const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const updateState = (field, value) => {
    setUser((current) => {
      return { ...current, [field]: value };
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
    }
  };

  const createUser = async (userData) => {
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const formData = new FormData();

      formData.append("username", userData.username);
      formData.append("password", userData.password);
      formData.append("first_name", userData.first_name);
      formData.append("last_name", userData.last_name);
      formData.append("email", userData.email);
      formData.append("phone", userData.phone);

      if (avatar) {
        formData.append("avatar", avatar);
      }

      for (const [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }

      const response = await APIs.post(endpoints["user"], formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log(endpoints["user"]);

      if (response.status === 201) {
        setSuccess(true);
        alert("Đăng ký thành công!");
        navigate("/login");
      } else if (response.status === 400) {
        const errorData = response.data;
        if (errorData.username) {
          setError("Tên người dùng đã tồn tại. Vui lòng chọn tên khác.");
        } else if (errorData.email) {
          setError("Email đã tồn tại. Vui lòng chọn email khác.");
        } else {
          throw new Error(errorData.message || "Đã xảy ra lỗi khi đăng ký.");
        }
      } else {
        throw new Error(`Lỗi: ${response.status}`);
      }
    } catch (error) {
      setError("Lỗi khi đăng ký: " + error.message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { first_name, last_name, username, email, phone, password } = user;
    if (
      !first_name ||
      !last_name ||
      !username ||
      !email ||
      !phone ||
      !password ||
      !avatar
    ) {
      alert("Vui lòng nhập đầy đủ thông tin trước khi đăng ký.");
      return;
    }
    
    if (!isValidEmail(user.email)) {
      alert("Vui lòng nhập một địa chỉ email hợp lệ.");
      return;
    }
    createUser(user);
  };

  return (
    <div className="app-container register-container">
      <div className="user-container">
        <div className="user-image">
          <img
            src="https://res.cloudinary.com/dkmurrwq5/image/upload/v1724688828/nen.png"
            alt="Register"
            className="image"
          />
        </div>

        <div className="user-form-container">
          <div className="user-form register-form">
            <h2 className="text-center">Đăng ký</h2>

            <Form onSubmit={handleSubmit}>
              <div className="inline-group">
                <Form.Group className="form-group">
                  <Form.Control
                    type="text"
                    placeholder="Tên và họ lót"
                    className="input-textbox"
                    id="last_name" 
                    onChange={(e) => updateState("last_name", e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="form-group">
                  <Form.Control
                    type="text"
                    placeholder="Tên"
                    className="input-textbox"
                    id="first_name"
                    onChange={(e) => updateState("first_name", e.target.value)}
                  />
                </Form.Group>
              </div>

              {fields.slice(2).map((field) => (
                <Form.Group
                  key={field.name}
                  className={`${
                    field.name === "password" || field.name === "confirm"
                      ? "password-container"
                      : ""
                  }`}
                >
                  <Form.Control
                    type={
                      field.name === "password" || field.name === "confirm"
                        ? visible
                          ? "text"
                          : "password"
                        : "text"
                    }
                    placeholder={field.label}
                    className="input-textbox"
                    onChange={(e) => updateState(field.name, e.target.value)}
                  />

                  {(field.name === "password" || field.name === "confirm") && (
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

              <Form.Group className="form-group form-avt">
                <Form.Label className="input-file-label">
                  Chọn ảnh đại diện
                </Form.Label>
                <Form.Control
                  type="file"
                  className="input-file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </Form.Group>

              {error && (
                <Alert className="text-center" variant="danger">
                  {error}
                </Alert>
              )}
              {success && <p style={{ color: "green" }}>Đăng ký thành công</p>}
              <Button
                variant="primary"
                type="submit"
                className="w-100 user-btn"
                disabled={loading}
              >
                {loading ? (
                  <Spinner animation="border" variant="light" size="sm" />
                ) : (
                  "Đăng ký"
                )}
              </Button>
            </Form>

            <div className="change-account text-center">
              <p>Đã có tài khoản?</p>
              <a href="/login">
                <i>Đăng nhập</i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
