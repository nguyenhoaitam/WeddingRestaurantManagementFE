import React from "react";
import { Container, Nav, Navbar, NavDropdown, Button } from "react-bootstrap";
import "./Header.css"

const Header = () => {
  return (
    <Navbar collapseOnSelect expand="lg" className="header">
      <Container>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="me-auto header-nav">
          <Nav.Link className="custom-nav-link" href="/hall">Sảnh Tiệc</Nav.Link>
          <NavDropdown title="Dịch Vụ" className="service" id="service-dropdown">
            <NavDropdown.Item href="#1">Văn Nghệ</NavDropdown.Item>
            <NavDropdown.Item href="#2">Trang Trí</NavDropdown.Item>
            <NavDropdown.Item href="#3">Vũ Đoàn</NavDropdown.Item>
          </NavDropdown>
          <Nav.Link className="custom-nav-link"href="#111">Thực Đơn</Nav.Link>
          <Nav.Link className="custom-nav-link" href="#11111">Ưu Đãi</Nav.Link>
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
          <Nav.Link href="#5">Đánh Giá</Nav.Link>
          <Nav.Link href="#6">Đặt Tiệc</Nav.Link>
          <Button variant="primary btn-login" href="/login">
            Đăng Nhập
          </Button>
        </Nav>

        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
