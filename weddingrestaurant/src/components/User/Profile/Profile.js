import { useContext, useEffect, useState } from "react";
import { Alert, Button, Col, Form, Image, Modal, Row, Spinner } from "react-bootstrap";
import {
  FaCamera,
  FaUserEdit,
  FaLock,
  FaSignOutAlt,
  FaEyeSlash,
  FaEye,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { MyDispatchContext, MyUserContext } from "../../../configs/Contexts";
import "./Profile.css";
import { authApi, endpoints } from "../../../configs/APIs";

const Profile = () => {
  const user = useContext(MyUserContext) || {};
  const dispatch = useContext(MyDispatchContext);
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(user.avatar || "");
  const [newAvatar, setNewAvatar] = useState(null);
  const [avatarModalVisible, setAvatarModalVisible] = useState(false);
  const [confirmAvatarModalVisible, setConfirmAvatarModalVisible] =
    useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changePasswordVisible, setChangePasswordModalVisible] =
    useState(false);
  const [visible, setVisible] = useState({
    old: false,
    new: false,
    confirm: false,
  });
  const [error, setError] = useState("");
  const [modalError, setModalError] = useState("");
  const [loading, setLoading] = useState(false);


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  };

  useEffect(() => {
    const fetchUserData = () => {
      const storedUsername = localStorage.getItem("username");
      const storedPassword = localStorage.getItem("password");
      setUsername(storedUsername || "");
      setPassword(storedPassword || "");
    };
    fetchUserData();
  }, [user]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewAvatar(file);
      setAvatar(URL.createObjectURL(file));
      setConfirmAvatarModalVisible(true);
    }
  };

  const handleConfirmAvatarChange = async () => {
    setLoading(true)
    if (!newAvatar) return;

    const formData = new FormData();
    formData.append("avatar", newAvatar);

    try {
      const token = localStorage.getItem("token");
      const api = authApi(token);
      const response = await api.patch(endpoints["current_user"], formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        alert("Thay đổi ảnh đại diện thành công!");
        setAvatar(URL.createObjectURL(newAvatar));
        setNewAvatar(null);
        setAvatarModalVisible(false);
        setLoading(false)
        window.location.reload();
      } else {
        setError("Thay đổi ảnh đại diện thất bại");
        setLoading(false)
      }
    } catch (error) {
      setError("Đã xảy ra lỗi khi cập nhật ảnh đại diện!");
      setLoading(false)
    }
    setConfirmAvatarModalVisible(false);
  };

  const handleCancelAvatarChange = () => {
    setAvatar(user.avatar || "");
    setNewAvatar(null);
    setConfirmAvatarModalVisible(false);
  };

  const handleChangePassword = async () => {
    setModalError("");

    if (!oldPassword || !newPassword || !confirmPassword) {
      setModalError("Vui lòng điền đầy đủ thông tin!");
      return;
    }
    if (oldPassword !== password) {
      setModalError("Mật khẩu cũ không chính xác!");
      return;
    }
    if (newPassword !== confirmPassword) {
      setModalError("Mật khẩu mới không khớp với xác nhận!");
      return;
    }

    const formData = new FormData();
    formData.append("password", newPassword);

    try {
      const token = localStorage.getItem("token");
      const api = authApi(token);
      const response = await api.patch(endpoints["current_user"], formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        alert("Thay đổi mật khẩu thành công!");
        setPassword(newPassword);
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        localStorage.setItem("password", newPassword);
        setChangePasswordModalVisible(false);        
      } else {
        setModalError("Thay đổi mật khẩu thất bại!");
      }
    } catch (error) {
      setModalError("Đã xảy ra lỗi khi thay đổi mật khẩu!");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("username");
    localStorage.removeItem("password");
    localStorage.removeItem("token");
    dispatch({ type: "logout" });
    navigate("/");
  };

  return (
    <>
      <div className="profile-container">
        <Row className="profile-header">
          <Col>
            <h1 className="profile-title text-center">THÔNG TIN TÀI KHOẢN</h1>
            <p>Xin chào {user.username}!</p>
          </Col>
        </Row>

        <Row>
          <Col className="profile-avatar">
            <Image
              src={user.avatar}
              roundedCircle
              width={200}
              height={200}
              onClick={() => setAvatarModalVisible(true)}
            />
            <label htmlFor="avatarUpload" className="camera-icon">
              <FaCamera />
            </label>
            <Form.Control
              id="avatarUpload"
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              style={{ display: "none" }}
            />
          </Col>
        </Row>

        <Row className="profile-content">
          <Col>
            <div className="profile-info">
              {user.user_role === "admin" && (
                <>
                  <p>
                    Họ và tên: {user.username ? user.username : "Chưa cập nhật"}
                  </p>
                  <p>
                    Ngày sinh:{" "}
                    {user.dob ? formatDate(user.dob) : "Chưa cập nhật"}
                  </p>
                  <p>
                    Giới tính: {user.gender ? user.gender : "Chưa cập nhật"}
                  </p>
                  <p>
                    Số điện thoại: {user.phone ? user.phone : "Chưa cập nhật"}
                  </p>
                  <p>
                    Số điện thoại: {user.email ? user.email : "Chưa cập nhật"}
                  </p>
                  <p>
                    Địa chỉ: {user.address ? user.address : "Chưa cập nhật"}
                  </p>
                </>
              )}
              {user.user_role === "customer" && (
                <>
                  <p>
                    Họ và tên:{" "}
                    {user.customer?.full_name
                      ? user.customer?.full_name
                      : "Chưa cập nhật"}
                  </p>
                  <p>
                    Ngày sinh:{" "}
                    {user.customer?.dob
                      ? formatDate(user.customer?.dob)
                      : "Chưa cập nhật"}
                  </p>
                  <p>
                    Giới tính:{" "}
                    {user.customer?.gender
                      ? user.customer?.gender
                      : "Chưa cập nhật"}
                  </p>
                  <p>
                    Số điện thoại: {user.phone ? user.phone : "Chưa cập nhật"}
                  </p>
                  <p>Email: {user.email}</p>
                  <p>
                    Địa chỉ:{" "}
                    {user.customer?.address
                      ? user.customer?.address
                      : "Chưa cập nhật"}
                  </p>
                </>
              )}
              {user.user_role === "staff" && (
                <>
                  <p>
                    Họ và tên:{" "}
                    {user.staff?.full_name
                      ? user.staff?.full_name
                      : "Chưa cập nhật"}
                  </p>
                  <p>
                    Vị trí:{" "}
                    {user.staff?.position
                      ? user.staff?.position
                      : "Chưa cập nhật"}
                  </p>
                  <p>
                    Lương cơ bản:{" "}
                    {user.staff?.salary
                      ? formatDate(user.staff?.salary)
                      : "Chưa cập nhật"}
                  </p>
                  <p>
                    Ngày sinh:{" "}
                    {user.staff?.dob
                      ? formatDate(user.staff?.dob)
                      : "Chưa cập nhật"}
                  </p>
                  <p>
                    Giới tính:{" "}
                    {user.staff?.gender ? user.staff?.gender : "Chưa cập nhật"}
                  </p>
                  <p>
                    Số điện thoại: {user.phone ? user.phone : "Chưa cập nhật"}
                  </p>
                  <p>
                    Số điện thoại: {user.email ? user.email : "Chưa cập nhật"}
                  </p>
                  <p>
                    Địa chỉ:{" "}
                    {user.staff?.address
                      ? user.staff?.address
                      : "Chưa cập nhật"}
                  </p>
                </>
              )}
            </div>
            {error && <Alert variant="danger">{error}</Alert>}
          </Col>
        </Row>

        <Row className="profile-actions">
          <Col className="d-flex justify-content-around">
            <Button
              variant="primary"
              // onClick={handleUpdateInfo}
              className="mx-2 btn-pf"
            >
              <FaUserEdit className="me-2" /> Cập nhật thông tin
            </Button>
            <Button
              variant="secondary"
              onClick={() => setChangePasswordModalVisible(true)}
              className="mx-2 btn-pf"
            >
              <FaLock className="me-2" /> Đổi mật khẩu
            </Button>
            <Button
              variant="danger"
              onClick={handleLogout}
              className="mx-2 btn-pf"
            >
              <FaSignOutAlt className="me-2" /> Đăng xuất
            </Button>
          </Col>
        </Row>

        <Modal
          show={changePasswordVisible}
          onHide={() => {
            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setModalError("");
            setChangePasswordModalVisible(false);
          }}
        >
          <Modal.Header closeButton>
            <Modal.Title>Đổi mật khẩu</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formOldPassword">
                <Form.Label>Mật khẩu cũ</Form.Label>
                <div className="input-wrapper">
                  <Form.Control
                    type={visible.old ? "text" : "password"}
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                  />
                  <span
                    className="icon-eye"
                    onClick={() =>
                      setVisible({ ...visible, old: !visible.old })
                    }
                  >
                    {visible.old ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </Form.Group>
              <Form.Group controlId="formNewPassword">
                <Form.Label>Mật khẩu mới</Form.Label>
                <div className="input-wrapper">
                  <Form.Control
                    type={visible.new ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <span
                    className="icon-eye"
                    onClick={() =>
                      setVisible({ ...visible, new: !visible.new })
                    }
                  >
                    {visible.new ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </Form.Group>
              <Form.Group controlId="formConfirmPassword">
                <Form.Label>Xác nhận mật khẩu</Form.Label>
                <div className="input-wrapper">
                  <Form.Control
                    type={visible.confirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <span
                    className="icon-eye"
                    onClick={() =>
                      setVisible({ ...visible, confirm: !visible.confirm })
                    }
                  >
                    {visible.confirm ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </Form.Group>
              {modalError && <Alert variant="danger">{modalError}</Alert>}
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => {
                setOldPassword("");
                setNewPassword("");
                setConfirmPassword("");
                setModalError("");
                setChangePasswordModalVisible(false);
              }}
            >
              Đóng
            </Button>
            <Button
              variant="primary"
              className="custom-primary-btn w-25"
              onClick={handleChangePassword}
            >
              Lưu thay đổi
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal
          className="modal-change-avt"
          show={confirmAvatarModalVisible}
          onHide={() => setConfirmAvatarModalVisible(false)}
        >
          <Modal.Header closeButton>
            <Modal.Title>Xác nhận đổi ảnh đại diện</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Image src={avatar} roundedCircle width={200} height={200} />
            <p>Bạn chắc chắn muốn thay đổi?</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCancelAvatarChange}>
              Hủy
            </Button>
            <Button
              variant="primary"
              className="custom-primary-btn w-25"
              onClick={handleConfirmAvatarChange}
              disabled={loading}
            >
              {loading ? <Spinner animation="border" variant="light" size="sm" /> : "Xác nhận"}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default Profile;
