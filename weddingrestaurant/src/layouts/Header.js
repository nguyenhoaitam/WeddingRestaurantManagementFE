import React from "react";
import { Container, Nav, Navbar, NavDropdown, Button } from "react-bootstrap";
import "./Header.css"

const Header = () => {
  return (
    <Navbar collapseOnSelect expand="lg" className="header">
      <Container>
        <Nav className="me-auto header-nav">
          <Nav.Link href="#offers">Sảnh Tiệc</Nav.Link>
          <NavDropdown title="Dịch Vụ" className="service" id="service-dropdown">
            <NavDropdown.Item href="#">Văn Nghệ</NavDropdown.Item>
            <NavDropdown.Item href="#">Trang Trí</NavDropdown.Item>
            <NavDropdown.Item href="#servi">Vũ Đoàn</NavDropdown.Item>
          </NavDropdown>
          <Nav.Link href="#offers">Thực Đơn</Nav.Link>
          <Nav.Link href="#offers">Ưu Đãi</Nav.Link>
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
          <Nav.Link href="#news">Tin Tức</Nav.Link>
          <Nav.Link href="#contact">Liên Hệ</Nav.Link>
          <Nav.Link href="#contact">Đặt tiệc</Nav.Link>
          <Button variant="primary btn-login" href="/login">
            Đăng Nhập
          </Button>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default Header;
