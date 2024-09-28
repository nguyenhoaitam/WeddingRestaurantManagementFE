import React, { useEffect } from "react";
import { Button, Carousel } from "react-bootstrap";
import { useSwipeable } from "react-swipeable";
import "../../App.css";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import WOW from 'wowjs';
import 'wowjs/css/libs/animate.css';

const Home = () => {
  const carouselRef = React.useRef(null);
  const navigate = useNavigate();

  const handlers = useSwipeable({
    onSwipedLeft: () => carouselRef.current.next(),
    onSwipedRight: () => carouselRef.current.prev(),
    trackMouse: true,
  });

  const reasons = [
    {
      imgSrc:
        "https://res.cloudinary.com/dkmurrwq5/image/upload/v1727192598/lydo1.png",
      title: "KHÔNG GIAN LÃNG MẠNG",
      description:
        "Mọi ý tưởng tổ chức tiệc cưới hoàn hảo để ghi dấu ngày trọng đại. Hãy để hôn lễ của bạn trở thành đại tiệc “cảm xúc” trong một không gian sang trọng, lãng mạn, ngập tràn tình yêu.",
    },
    {
      imgSrc:
        "https://res.cloudinary.com/dkmurrwq5/image/upload/v1727192598/lydo2.png",
      title: "TRANG TRÍ TINH TẾ",
      description:
        "Chúng tôi sẽ phác họa nên tiệc cưới như bạn hằng mơ ước bằng những chi tiết trang trí tinh tế. Bạn có thể lựa chọn từ phong cách cổ điển, trang nhã cho đến ấn tượng xa hoa.",
    },
    {
      imgSrc:
        "https://res.cloudinary.com/dkmurrwq5/image/upload/v1727192598/lydo3.png",
      title: "CHƯƠNG TRÌNH HẤP DẪN",
      description:
        "Mỗi tiệc cưới sẽ mang một phong cách khác biệt, một không gian độc đáo, cũng như một chương trình trọn vẹn dành riêng cho bạn. Hãy để chúng tôi tư vấn một chương trình tiệc phù hợp với sở thích và nhu cầu của bạn.",
    },
  ];

  useEffect(() => {
    new WOW.WOW().init();
  }, []);

  return (
    <>
      <div {...handlers} className="carousel-container">
        <Carousel interval={2500} ref={carouselRef}>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src="https://res.cloudinary.com/dkmurrwq5/image/upload/v1724837919/pt1.png"
              alt="First slide"
            />
            <Carousel.Caption className="caption">
              <h3>TIỆC CƯỚI TRONG MƠ</h3>
              <p>Với không gian lấp lánh đầy nến và hoa.</p>
            </Carousel.Caption>
          </Carousel.Item>

          <Carousel.Item>
            <img
              className="d-block w-100"
              src="https://res.cloudinary.com/dkmurrwq5/image/upload/v1724837919/pt2.png"
              alt="Second slide"
            />
            <Carousel.Caption className="caption">
              <h3>HỘI NGHỊ SANG TRỌNG</h3>
              <p>Không gian thanh lịch với dịch vụ đẳng cấp và tiện nghi.</p>
            </Carousel.Caption>
          </Carousel.Item>

          <Carousel.Item>
            <img
              className="d-block w-100"
              src="https://res.cloudinary.com/dkmurrwq5/image/upload/v1724837919/pt3.png"
              alt="Third slide"
            />
            <Carousel.Caption className="caption">
              <h3>SINH NHẬT VUI TƯƠI</h3>
              <p>
                Không gian ấm cúng, trang trí rực rỡ và và đầy ắp quà tặng bất
                ngờ.
              </p>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>
      </div>
      <div className="reason-container">
        <h4 className="text-center reason-title">
          LÝ DO KHÁCH HÀNG LỰA CHỌN CHÚNG TÔI
        </h4>
        <div className="container">
          <div className="row wow fadeInUp" data-wow-duration="1s">
            {reasons.map((reason, index) => (
              <div className="col-4" key={index}>
                <div className="card mb-4 reason-card">
                  <img
                    src={reason.imgSrc}
                    className="card-img-top"
                    alt={reason.title}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{reason.title}</h5>
                    <p className="card-text">{reason.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="luxury-hall">
        <div className="text-overlay">
          <h2 className="title wow fadeInUp" data-wow-duration="0.55s">
            SẢNH TIỆC SANG TRỌNG
          </h2>
          <p
            className="description wow fadeInUp"
            data-wow-duration="0.75s"
            data-wow-delay="200ms"
          >
            Không gian tiệc cưới lộng lẫy và ấn tượng với các sảnh tiệc được lấy
            cảm hứng từ những thành đô hoa lệ trên thế giới.
          </p>
          <Button
            variant="primary"
            type="button"
            className="luxury-hall-btn wow fadeInUp"
            data-wow-duration="1s"
            data-wow-delay="400ms"
            onClick={() => navigate("/hall")}
          >
            Xem ngay
          </Button>
        </div>
      </div>
    </>
  );
};

export default Home;
