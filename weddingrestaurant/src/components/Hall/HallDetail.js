import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import APIs, { endpoints } from "../../configs/APIs";
import "./HallDetail.css";
import { formatCurrency } from "../Base/Base"

const HallDetail = () => {
  const { hallId } = useParams();
  const [hall, setHall] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadHallDetail = async () => {
      try {
        const response = await APIs.get(
          `${endpoints["wedding_halls"]}${hallId}/`
        );
        setHall(response.data);
        setError(false);
      } catch (error) {
        console.error("Lỗi khi nạp chi tiết sảnh:", error);
        setError(true);
      }
    };

    loadHallDetail();
  }, [hallId]);

  if (error) {
    return (
      <p className="error-message">Không có thông tin chi tiết cho sảnh này.</p>
    );
  }

  if (!hall) {
    return <p className="loading-message">Đang tải dữ liệu...</p>;
  }

  const renderPrices = () => {
    const times = ["Sáng", "Trưa", "Tối"];
    const weekdays = hall.prices.filter((price) => !price.is_weekend);
    const weekends = hall.prices.filter((price) => price.is_weekend);

    return (
      <table className="price-table">
        <thead>
          <tr>
            <th>Buổi</th>
            <th>Trong tuần</th>
            <th>Cuối tuần</th>
          </tr>
        </thead>
        <tbody>
          {times.map((time) => {
            const weekdayPrice = weekdays.find((price) => price.time === time);
            const weekendPrice = weekends.find((price) => price.time === time);

            return (
              <tr key={time}>
                <td>{time}</td>
                <td>
                  {weekdayPrice ? formatCurrency(weekdayPrice.price) : "N/A"}
                </td>
                <td>
                  {weekendPrice ? formatCurrency(weekendPrice.price) : "N/A"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };

  return (
    <div className="hall-detail-container">
      <h1 className="text-center hall-name">Tên sảnh: {hall.name}</h1>
      <div className="hall-detail-main">
        <div className="hall-detail-images">
          {hall.images && hall.images.length > 0 ? (
            hall.images.map((image, index) => (
              <img key={index} src={image} alt={`Hall ${hall.name}`} />
            ))
          ) : (
            <p>Không có ảnh cho sảnh này.</p>
          )}
        </div>

        <div className="hall-detail-info">
          <h2>Sức chứa</h2>
          <p>{hall.capacity} khách</p>

          <h2>Mô tả</h2>
          <div dangerouslySetInnerHTML={{ __html: hall.description }} />
        </div>
      </div>

      <div className="hall-detail-prices">
        <h2>Bảng giá</h2>
        {renderPrices()}
      </div>

      <div className="button-group btn-booking">
        <a href="/booking" className="btn btn-primary">
          Đặt ngay
        </a>
      </div>
    </div>
  );
};

export default HallDetail;
