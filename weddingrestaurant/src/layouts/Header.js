import React, { useContext } from "react";
import { Container, Nav, Navbar, NavDropdown, Button } from "react-bootstrap";
import "./Header.css";
import { MyUserContext, MyDispatchContext } from "../configs/Contexts";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const user = useContext(MyUserContext);
  const dispatch = useContext(MyDispatchContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("username");
    localStorage.removeItem("password");
    localStorage.removeItem("token");
    dispatch({ type: "logout" });
    navigate("/");
    // window.location.reload();
  };

  const handleViewProfile = () => {
    navigate("/profile");
  };

  const handleViewBooking = () => {
    navigate("/booking");
  };

  return (
    <Navbar collapseOnSelect expand="lg" className="header">
      <Container>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto header-nav">
            <Nav.Link href="/">Trang chủ</Nav.Link>
            <Nav.Link href="/hall">Sảnh Tiệc</Nav.Link>
            <Nav.Link href="/service">Dịch Vụ</Nav.Link>
            <Nav.Link href="/menu">Thực Đơn</Nav.Link>
          </Nav>

          <Navbar.Brand href="/" className="mx-auto">
            <img
              src="https://res.cloudinary.com/dkmurrwq5/image/upload/v1724776006/eden.png"
              alt="Logo"
              height="40"
              className="d-inline-block align-top"
            />
          </Navbar.Brand>

          <Nav className="ms-auto header-nav">
            <Nav.Link href="#4">Tin Tức</Nav.Link>
            <Nav.Link href="#11111">Ưu Đãi</Nav.Link>
            <Nav.Link href="#5">Đánh Giá</Nav.Link>
            <Nav.Link href="/booking">Đặt Tiệc</Nav.Link>
            {user ? (
              <NavDropdown
                title={
                  <img src={user.avatar} alt="Avatar" className="avatar" />
                }
                className="user-dropdown"
              >
                <NavDropdown.Item onClick={handleViewProfile}>
                  Xem thông tin
                </NavDropdown.Item>
                <NavDropdown.Item onClick={handleViewBooking}>
                  Tiệc đã đặt
                </NavDropdown.Item>
                <NavDropdown.Item onClick={handleLogout}>
                  Đăng xuất
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <Button variant="primary btn-login" href="/login">
                Đăng Nhập
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
