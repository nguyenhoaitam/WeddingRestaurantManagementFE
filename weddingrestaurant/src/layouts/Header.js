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
    navigate("/customer_booking");
  };

  const renderMenu = () => {
    if (!user) {
      return (
        <>
          <Nav.Link href="#">Tin Tức</Nav.Link>
          <Nav.Link href="#">Ưu Đãi</Nav.Link>
          <Nav.Link href="/feedback">Đánh Giá</Nav.Link>
          <Nav.Link href="/booking">Đặt Tiệc</Nav.Link>
          <Button variant="primary btn-login" href="/login">
            Đăng Nhập
          </Button>
        </>
      );
    }

    if (user.user_role === "admin") {
      return (
        <>
          <Nav.Link href="#">Ưu Đãi</Nav.Link>
          <Nav.Link href="/feedback_review">Xem Đánh Giá</Nav.Link>
          <Nav.Link href="/statistical">Thống Kê</Nav.Link>
          <Nav.Link href="/management">Quản Lý</Nav.Link>
          <NavDropdown
            title={<img src={user.avatar} alt="Avatar" className="avatar" />}
            className="user-dropdown"
          >
            <NavDropdown.Item onClick={handleViewProfile}>
              Xem Thông Tin
            </NavDropdown.Item>
            <NavDropdown.Item onClick={handleLogout}>
              Đăng Xuất
            </NavDropdown.Item>
          </NavDropdown>
        </>
      );
    }

    if (user.user_role === "staff") {
      return (
        <>
          <Nav.Link href="#">Ưu Đãi</Nav.Link>
          <Nav.Link href="/feedback_review">Xem Đánh Giá</Nav.Link>
          <Nav.Link href="#">Xem Tiệc Đã Đặt</Nav.Link>
          <Nav.Link href="/contact_list">Nhắn tin</Nav.Link>
          <NavDropdown
            title={<img src={user.avatar} alt="Avatar" className="avatar" />}
            className="user-dropdown"
          >
            <NavDropdown.Item onClick={handleViewProfile}>
              Xem Thông Tin
            </NavDropdown.Item>
            <NavDropdown.Item onClick={handleLogout}>
              Đăng Xuất
            </NavDropdown.Item>
          </NavDropdown>
        </>
      );
    }

    if (user.user_role === "customer") {
      return (
        <>
          <Nav.Link href="#">Ưu Đãi</Nav.Link>
          <Nav.Link href="/feedback">Đánh Giá</Nav.Link>
          <Nav.Link href="/booking">Đặt Tiệc</Nav.Link>
          <Nav.Link href="/contact_list">Nhắn tin</Nav.Link>
          <NavDropdown
            title={<img src={user.avatar} alt="Avatar" className="avatar" />}
            className="user-dropdown"
          >
            <NavDropdown.Item onClick={handleViewProfile}>
              Xem Thông Tin
            </NavDropdown.Item>
            <NavDropdown.Item onClick={handleViewBooking}>
              Tiệc Của Tôi
            </NavDropdown.Item>
            <NavDropdown.Item onClick={handleLogout}>
              Đăng Xuất
            </NavDropdown.Item>
          </NavDropdown>
        </>
      );
    }
  };

  return (
    <Navbar collapseOnSelect expand="lg" className="header">
      <Container>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto header-nav">
            <Nav.Link href="/">Trang Chủ</Nav.Link>
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
            {renderMenu()}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
