import React from "react";
import { Carousel } from "react-bootstrap";
import { useSwipeable } from "react-swipeable";
import "../../App.css";
import "./Home.css";

const Home = () => {
  const carouselRef = React.useRef(null);

  const handlers = useSwipeable({
    onSwipedLeft: () => carouselRef.current.next(),
    onSwipedRight: () => carouselRef.current.prev(),
    trackMouse: true,
  });

  return (
    <div {...handlers} className="carousel-container">
      <Carousel interval={2000} ref={carouselRef}>
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
            <p>Không gian ấm cúng, trang trí rực rỡ và và đầy ắp quà tặng bất ngờ.</p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
    </div>
  );
};

export default Home;
