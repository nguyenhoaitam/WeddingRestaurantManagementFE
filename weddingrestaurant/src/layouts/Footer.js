import React from "react";
import { Container, Row, Col, Nav } from "react-bootstrap";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <Container>
        <Row>
          <Col md={4} className="footer-col">
            <div className="footer-logo-container">
              <div className="text-center">
                <img
                  src="https://res.cloudinary.com/dkmurrwq5/image/upload/v1724691543/logo3.png"
                  alt="Logo"
                  className="footer-logo"
                />

                <div className="contact-info">
                  <h5>THÔNG TIN LIÊN HỆ</h5>
                  <p>99 Nguyễn Hữu Thọ, P.Tân Hưng, Quận 7, TP.HCM</p>
                  <p>Điện thoại: 039 487 9999</p>
                  <p>Email: info.edenplace@gmail.com</p>
                </div>
              </div>
            </div>
          </Col>

          <Col md={4} className="footer-col">
            <h5>CHÍNH SÁCH</h5>
            <Nav className="flex-column">
              <Nav.Link href="#">Chính sách bảo mật</Nav.Link>
              <Nav.Link href="#">Điều khoản dịch vụ</Nav.Link>
              <Nav.Link href="#">Chính sách hoàn trả</Nav.Link>
            </Nav>
          </Col>

          <Col md={4} className="footer-col">
            <h5>THEO DÕI CHÚNG TÔI</h5>
            <Nav className="social-icons">
              <Nav.Link href="#">
                <img
                  src="https://res.cloudinary.com/dkmurrwq5/image/upload/v1724739568/facebook_icon.png"
                  alt="Facebook"
                  className="social-icon"
                />
              </Nav.Link>
              <Nav.Link href="#">
                <img
                  src="https://res.cloudinary.com/dkmurrwq5/image/upload/v1724824698/logo_instagram.png"
                  alt="Instagram"
                  className="social-icon"
                />
              </Nav.Link>
              <Nav.Link href="#">
                <img
                  src="https://res.cloudinary.com/dkmurrwq5/image/upload/v1724824562/logo_youtube.png"
                  alt="Youtube"
                  className="social-icon"
                />
              </Nav.Link>
            </Nav>
          </Col>
        </Row>
        <Row>
          <Col className="text-center">
            <p className="footer-copy">&copy; 2024 Eden Palace.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
