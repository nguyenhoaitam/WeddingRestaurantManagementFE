import { useState, useEffect } from "react";
import APIs, { endpoints } from "../../configs/APIs";
import "./Hall.css";

const formatCurrency = (value) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
};

const Hall = () => {
  const [halls, setHalls] = useState([]);
  const [error, setError] = useState(false);
  const [currentDate, setCurrentDate] = useState("");
  const [filters, setFilters] = useState({
    q: "",
    min_price: "",
    max_price: "",
    time: "Sáng",
    event_date: "",
  });

  const getCurrentDate = () => new Date().toISOString().split("T")[0];

  const getPriceForTime = (hall) => {
    const priceData = hall.prices.find((price) => price.time === filters.time);
    return priceData ? formatCurrency(priceData.price) : null;
  };

  const loadHalls = async () => {
    try {
      const params = {};

      if (filters.q) params.q = filters.q;
      if (filters.min_price) params.min_price = filters.min_price;
      if (filters.max_price) params.max_price = filters.max_price;
      if (filters.time) params.time = filters.time;
      if (filters.event_date) {
        params.event_date = filters.event_date;
      } else {
        params.event_date = getCurrentDate();
      }

      const response = await APIs.get(endpoints["wedding_halls"], { params });
      const hallsWithBookingStatus = await checkBookingStatus(response.data);
      setHalls(hallsWithBookingStatus);
      setError(false);
    } catch (error) {
      console.error("Lỗi khi nạp dữ liệu:", error);
      setHalls([]);
      setError(true);
    }
  };

  const checkBookingStatus = async (halls) => {
    const rentalDate = filters.event_date || getCurrentDate();
    const timeOfDay = filters.time;

    const updatedHalls = await Promise.all(
      halls.map(async (hall) => {
        const response = await APIs.get(endpoints["check_booking_status"], {
          params: {
            rental_date: rentalDate,
            time_of_day: timeOfDay,
            wedding_hall_id: hall.id,
          },
        });

        return {
          ...hall,
          is_booked: response.data.is_booked,
        };
      })
    );

    return updatedHalls;
  };

  useEffect(() => {
    loadHalls();
    setCurrentDate(getCurrentDate());
  }, [filters, filters.event_date]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "price_range") {
      const [min_price, max_price] = value.split("-");
      setFilters({
        ...filters,
        min_price: min_price,
        max_price: max_price,
      });
    } else if (name === "event_date") {
      setFilters({
        ...filters,
        [name]: value,
      });
    } else {
      setFilters({
        ...filters,
        [name]: value,
      });
    }
  };

  return (
    <>
      <div className="filter-container">
        <input
          type="text"
          name="q"
          placeholder="Nhập thông tin tìm kiếm..."
          className="search-input"
          value={filters.q}
          onChange={handleInputChange}
        />

        <select
          name="price_range"
          className="price-select"
          value={filters.price_range}
          onChange={handleInputChange}
        >
          <option value="">Chọn khoảng giá</option>
          <option value="0-5000000">Dưới 5 triệu</option>
          <option value="5000000-10000000">5 - 10 triệu</option>
          <option value="10000000-15000000">10 - 15 triệu</option>
          <option value="15000000-20000000">15 - 20 triệu</option>
          <option value="20000000-100000000">Trên 20 triệu</option>
        </select>

        <select
          name="time"
          className="session-select"
          value={filters.time}
          onChange={handleInputChange}
        >
          <option value="Sáng">Buổi sáng</option>
          <option value="Trưa">Buổi trưa</option>
          <option value="Tối">Buổi tối</option>
        </select>

        <input
          type="date"
          name="event_date"
          className="date-picker"
          value={filters.event_date || currentDate}
          onChange={(e) => {
            setFilters({
              ...filters,
              event_date: e.target.value,
            });
          }}
        />
      </div>

      <div className="card-container hall-container">
        {error ? (
          <p className="error-message">Không có sảnh tiệc nào để hiển thị.</p>
        ) : halls.length === 0 ? (
          <p className="no-data-message">Không có sảnh tiệc nào để hiển thị.</p>
        ) : (
          halls.map((hall) => (
            <div key={hall.id} className="card card-hall">
              {hall.images && hall.images.length > 0 ? (
                <img
                  className="card-img-hall"
                  src={hall.images[0]}
                  alt="Hall"
                />
              ) : (
                <div className="card-img-placeholder">
                  Ảnh của sảnh {hall.name}.
                </div>
              )}
              <div className="card-body">
                {hall.is_booked && (
                  <span className="tag booked">Đã được đặt</span>
                )}
                <h5 className="card-title">{hall.name}</h5>
                <p className="card-text">Giá: {getPriceForTime(hall)}</p>
                <div className="button-group">
                  <a
                    href={`/wedding_hall/${hall.id}`}
                    className="btn btn-primary"
                  >
                    Xem chi tiết
                  </a>
                  <a href="#order" className="btn btn-primary">
                    Đặt ngay
                  </a>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default Hall;
