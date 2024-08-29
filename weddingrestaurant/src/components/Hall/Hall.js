import { useState } from "react";
import APIs, { endpoints } from "../../configs/APIs";
import "./Hall.css";
import { useEffect } from "react";

const Hall = () => {
  const [halls, setHalls] = useState([]);

  const loadHalls = async () => {
    try {
      const response = await APIs.get(endpoints["wedding_halls"]);
      setHalls(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    loadHalls();
  }, []);

  return (
    <>
      <div className="filter-container">
        <input
          type="text"
          placeholder="Nhập thông tin tìm kiếm..."
          className="search-input"
        />

        <select className="price-select">
          <option value="">Chọn khoảng giá</option>
          <option value="under5">Dưới 5 triệu</option>
          <option value="5to10">5 - 10 triệu</option>
          <option value="10to15">10 - 15 triệu</option>
          <option value="15to20">15 - 20 triệu</option>
          <option value="above20">Trên 20 triệu</option>
        </select>

        <select className="session-select">
          <option value="">Chọn buổi</option>
          <option value="morning">Buổi sáng</option>
          <option value="afternoon">Buổi trưa</option>
          <option value="evening">Buổi tối</option>
        </select>

        <input type="date" className="date-picker" />
      </div>

      <div className="card-container hall-container">
        {halls.map((hall) => (
          <div key={hall.id} className="card card-hall">
            {hall.images && hall.images.length > 0 ? (
              <img className="card-img-top" src={hall.images[0]} alt="Hall" />
            ) : (
              <div className="card-img-placeholder">Ảnh của sảnh {hall.name}.</div>
            )}
            <div className="card-body">
              <h5 className="card-title">{hall.name}</h5>
              <p className="card-text">
                {hall.prices && hall.prices.length > 0
                  ? hall.prices[0].price.toLocaleString() + " VND"
                  : "Không có giá hiển thị"}
              </p>
              <div className="button-group">
                <a href="#sss" className="btn btn-primary">
                  Xem chi tiết
                </a>
                <a href="#order" className="btn btn-primary">
                  Đặt ngay
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Hall;
