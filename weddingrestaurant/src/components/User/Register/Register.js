import { register } from "swiper/element";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import React, { useState } from "react";
import { Alert, Button, Form, Spinner } from "react-bootstrap";
import "../User.css";
import "../Register/Register.css";

const Register = () => {
  const [user, setUser] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [visible, setVisible] = useState(false);
  const [isInfoEntered, setIsInfoEntered] = useState(false);
  const [avatar, setAvatar] = useState(null);

  const fields = [
    {
      label: "Tên và họ lót",
      icon: "text",
      name: "last_name",
    },
    {
      label: "Tên",
      icon: "text",
      name: "first_name",
    },
    {
      label: "Tên đăng nhập",
      icon: "account",
      name: "username",
    },
    {
      label: "Email",
      icon: "email",
      name: "email",
    },
    {
      label: "Số điện thoại",
      icon: "text",
      name: "phone",
    },
    {
      label: "Mật khẩu",
      icon: !visible ? "eye-off" : "eye",
      secureTextEntry: true,
      name: "password",
    },
    {
      label: "Xác nhận mật khẩu",
      icon: !visible ? "eye-off" : "eye",
      secureTextEntry: true,
      name: "confirm",
    },
  ];

  const updateState = (field, value) => {
    setUser((current) => {
      return { ...current, [field]: value };
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      register();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(URL.createObjectURL(file));
    }
  };

  const onFieldChange = (field, value) => {
    updateState(field, value);
    setIsInfoEntered(fields.every((field) => user[field.name]?.trim() !== ""));
  };

  return (
    <>
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

              <Form>
                <div className="inline-group">
                  <Form.Group controlId="last_name" className="form-group">
                    <Form.Control
                      type="text"
                      placeholder="Tên và họ lót"
                      className="input-textbox"
                      onChange={(e) =>
                        onFieldChange("last_name", e.target.value)
                      }
                      onKeyDown={handleKeyDown}
                    />
                  </Form.Group>

                  <Form.Group controlId="first_name" className="form-group">
                    <Form.Control
                      type="text"
                      placeholder="Tên"
                      className="input-textbox"
                      onChange={(e) =>
                        onFieldChange("first_name", e.target.value)
                      }
                      onKeyDown={handleKeyDown}
                    />
                  </Form.Group>
                </div>

                {fields.slice(2).map((field) => (
                  <Form.Group
                    controlId={field.name}
                    key={field.name}
                    className={`${
                      field.name === "password" || field.name === "confirm"
                        ? "password-container"
                        : ""
                    } ${
                      field.name === "last_name" || field.name === "first_name"
                        ? "inline-group"
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
                      onChange={(e) =>
                        onFieldChange(field.name, e.target.value)
                      }
                      onKeyDown={handleKeyDown}
                    />

                    {(field.name === "password" ||
                      field.name === "confirm") && (
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

                <Form.Group controlId="avatar" className="form-group form-avt">
                  <Form.Label className="input-file-label">Chọn ảnh đại diện</Form.Label>
                  <Form.Control
                    type="file"
                    className="input-file"
                    id="avatar-upload"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </Form.Group>

                {error && (
                  <Alert className="text-center" variant="danger">
                    {error}
                  </Alert>
                )}
                <Button
                  variant="primary"
                  type="button"
                  className="w-100 user-btn"
                  onClick={register}
                  disabled={loading}
                >
                  {loading ? <Spinner animation="border" variant="light" size="sm" /> : "Đăng kỹ"}
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
    </>
  );
};

export default Register;
