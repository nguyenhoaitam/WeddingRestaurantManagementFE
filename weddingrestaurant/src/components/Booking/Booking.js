import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Booking.css";
import APIs, { endpoints } from "../../configs/APIs";
import { BsArrowRightCircleFill } from "react-icons/bs";

const formatCurrency = (value) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
};

const BookingPage = () => {
  const [foods, setFoods] = useState([]);
  const [drinks, setDrinks] = useState([]);
  const [services, setServices] = useState([]);
  const [halls, setHalls] = useState([]);
  const [eventTypes, setEventTypes] = useState([]);
  const [foodTypes, setFoodTypes] = useState([]);
  const [selectedFoodType, setSelectedFoodType] = useState("");
  const [foodPage, setFoodPage] = useState(1);
  const [drinkPage, setDrinkPage] = useState(1);
  const [servicePage, setServicePage] = useState(1);
  const [loadingMoreFoods, setLoadingMoreFoods] = useState(false);
  const [loadingMoreDrinks, setLoadingMoreDrinks] = useState(false);
  const [loadingMoreServices, setLoadingMoreServices] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    table_quantity: "",
    rental_date: "",
    time_of_day: "",
    wedding_hall: "",
    payment_method: "Tiền mặt",
    selectedFoods: [],
    selectedDrinks: [],
    selectedServices: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const foodResponse = await APIs.get(endpoints["foods"]);
        const drinkResponse = await APIs.get(endpoints["drinks"]);
        const serviceResponse = await APIs.get(endpoints["services"]);
        const hallResponse = await APIs.get(endpoints["wedding_halls"]);
        const eventTypeResponse = await APIs.get(endpoints["event_types"]);
        const foodTypeResponse = await APIs.get(endpoints["food_types"]);

        setFoods(foodResponse.data.results);
        setDrinks(drinkResponse.data.results);
        setServices(serviceResponse.data.results);
        setHalls(hallResponse.data);
        setEventTypes(eventTypeResponse.data);
        setFoodTypes(foodTypeResponse.data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCheckboxChange = (e) => {
    const { name, value, checked } = e.target;
    const updatedList = checked
      ? [...formData[name], value]
      : formData[name].filter((item) => item !== value);
    setFormData({
      ...formData,
      [name]: updatedList,
    });
    calculateTotalPrice(updatedList, name);
  };

  const handleFoodTypeChange = async (e) => {
    const typeId = e.target.value;
    setSelectedFoodType(typeId);
    setFoodPage(1);
    const response = await APIs.get(
      `${endpoints["foods"]}?foodtype_id=${typeId}&page=1`
    );
    setFoods(response.data.results);
    calculateTotalPrice(formData.selectedFoods, "selectedFoods");
  };

  const loadMoreFoods = async () => {
    setLoadingMoreFoods(true);
    const response = await APIs.get(
      `${endpoints["foods"]}?foodtype_id=${selectedFoodType}&page=${
        foodPage + 1
      }`
    );
    setFoods([...foods, ...response.data.results]);
    setFoodPage(foodPage + 1);
    setLoadingMoreFoods(false);
  };

  const loadMoreDrinks = async () => {
    setLoadingMoreDrinks(true);
    const response = await APIs.get(
      `${endpoints["drinks"]}?page=${drinkPage + 1}`
    );
    setDrinks([...drinks, ...response.data.results]);
    setDrinkPage(drinkPage + 1);
    setLoadingMoreDrinks(false);
  };

  const loadMoreServices = async () => {
    setLoadingMoreServices(true);
    const response = await APIs.get(
      `${endpoints["services"]}?page=${servicePage + 1}`
    );
    setServices([...services, ...response.data.results]);
    setServicePage(servicePage + 1);
    setLoadingMoreServices(false);
  };

  const calculateTotalPrice = (selectedItems, type) => {
    let total = 0;

    if (type === "selectedFoods") {
      selectedItems.forEach((foodName) => {
        const food = foods.find((food) => food.name === foodName);
        if (food) {
          total += food.price;
        }
      });
    }

    if (type === "selectedDrinks") {
      selectedItems.forEach((drinkName) => {
        const drink = drinks.find((drink) => drink.name === drinkName);
        if (drink) {
          total += drink.price;
        }
      });
    }

    if (type === "selectedServices") {
      selectedItems.forEach((serviceName) => {
        const service = services.find(
          (service) => service.name === serviceName
        );
        if (service) {
          total += service.price;
        }
      });
    }

    setTotalPrice(total);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/bookings", {
        ...formData,
        total_price: totalPrice,
      });
      alert("Đặt tiệc thành công!");
      console.log(response.data);
    } catch (error) {
      console.error("Lỗi khi đặt tiệc:", error);
      alert("Có lỗi xảy ra, vui lòng thử lại.");
    }
  };

  return (
    <div className="booking-page">
      <h1 className="text-center">Đặt Tiệc</h1>
      <div className="booking-container">
        <div className="left-section">
          <div className="customer-info">
            <h2>Thông tin khách hàng</h2>
            <form>
              <div className="form-group">
                <label htmlFor="customer_name">Họ và tên</label>
                <input
                  type="text"
                  id="customer_name"
                  name="customer_name"
                  required
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="customer_phone">Số điện thoại</label>
                <input
                  type="tel"
                  id="customer_phone"
                  name="customer_phone"
                  required
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="customer_email">Email</label>
                <input
                  type="email"
                  id="customer_email"
                  name="customer_email"
                  required
                  onChange={handleChange}
                />
              </div>
            </form>
          </div>
          <form onSubmit={handleSubmit}>
            <h2>Thông tin bữa tiệc</h2>
            <div className="form-group">
              <label htmlFor="name">Tên bữa tiệc</label>
              <input
                type="text"
                id="name"
                name="name"
                required
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Mô tả tiệc</label>
              <textarea
                id="description"
                name="description"
                placeholder="Thông tin trang trí sảnh(Phong cách, màu chủ đạo, ...) hoặc các yêu cầu khác."
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="wedding_hall">Chọn sảnh tiệc</label>
              <select
                id="wedding_hall"
                name="wedding_hall"
                onChange={handleChange}
                required
              >
                <option value="">Chọn sảnh</option>
                {halls.map((hall) => (
                  <option key={hall.id} value={hall.id}>
                    {hall.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="table_quantity">Số lượng bàn</label>
              <input
                type="number"
                id="table_quantity"
                name="table_quantity"
                required
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Loại tiệc</label>
              <select name="event_type" onChange={handleChange} required>
                <option value="">Chọn loại tiệc</option>
                {eventTypes.map((eventType) => (
                  <option key={eventType.id} value={eventType.id}>
                    {eventType.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="rental_date">Ngày tổ chức</label>
              <input
                type="date"
                id="rental_date"
                name="rental_date"
                required
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Thời gian tổ chức</label>
              <select name="time_of_day" onChange={handleChange} required>
                <option value="">Chọn thời gian</option>
                <option value="Sáng">Buổi sáng</option>
                <option value="Chiều">Buổi chiều</option>
                <option value="Tối">Buổi tối</option>
              </select>
            </div>
          </form>
        </div>

        <div className="right-section">
          <h2>Thông tin thực đơn</h2>
          <div className="food-item">
            <div className="form-group">
              <h5>Thức ăn</h5>
              <div>
                <select onChange={handleFoodTypeChange}>
                  <option value="">Tất cả loại món ăn</option>
                  {foodTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="booking-menu-items">
              <div className="booking-food-list">
                {foods.map((food) => (
                  <div className="booking-food-item" key={food.id}>
                    <label>
                      <input
                        type="checkbox"
                        value={food.name}
                        checked={formData.selectedFoods.includes(food.name)}
                        onChange={handleCheckboxChange}
                        name="selectedFoods"
                      />
                      Chọn
                    </label>
                    <p>
                      {food.name} - Giá: {formatCurrency(food.price)} / bàn
                    </p>
                  </div>
                ))}
                {loadingMoreFoods && <div className="spinner">Loading...</div>}
                <button
                  className="booking-loading-more"
                  onClick={loadMoreFoods}
                  disabled={loadingMoreFoods}
                >
                  Tải thêm món ăn
                </button>
              </div>
            </div>
          </div>

          <div className="drink-items">
            <h5>Nước uống</h5>
            <div className="booking-menu-items">
              {drinks.map((drink) => (
                <div className="drink-item" key={drink.id}>
                  <label>
                    <input
                      type="checkbox"
                      value={drink.name}
                      checked={formData.selectedDrinks.includes(drink.name)}
                      onChange={handleCheckboxChange}
                      name="selectedDrinks"
                    />
                    Chọn
                  </label>
                  <p>
                    {drink.name} - Giá: {formatCurrency(drink.price)}
                  </p>
                </div>
              ))}
              {loadingMoreDrinks && <div className="spinner">Loading...</div>}
              <button
                className="booking-loading-more"
                onClick={loadMoreDrinks}
                disabled={loadingMoreDrinks}
              >
                Tải thêm nước uống
              </button>
            </div>
          </div>

          <div className="service-items">
            <h5>Dịch vụ</h5>
            <div className="booking-menu-items">
              {services.map((service) => (
                <div className="service-item" key={service.id}>
                  <label>
                    <input
                      type="checkbox"
                      value={service.name}
                      checked={formData.selectedServices.includes(service.name)}
                      onChange={handleCheckboxChange}
                      name="selectedServices"
                    />
                    Chọn
                  </label>
                  <p>
                    {service.name} - Giá: {formatCurrency(service.price)}
                  </p>
                </div>
              ))}
              {loadingMoreServices && <div className="spinner">Loading...</div>}
              <button
                className="booking-loading-more"
                onClick={loadMoreServices}
                disabled={loadingMoreServices}
              >
                Tải thêm dịch vụ
              </button>
            </div>
          </div>

          <div className="selected-items">
            <h3>Tất cả:</h3>
            <ul>
              <li className="total-select">Thức ăn: </li>
              {formData.selectedFoods.map((food, index) => (
                <li key={index}>{food}</li>
              ))}
              <li className="total-select">Nước uống:</li>
              {formData.selectedDrinks.map((drink, index) => (
                <li key={index}>{drink}</li>
              ))}
              <li className="total-select">Dịch vụ:</li>
              {formData.selectedServices.map((service, index) => (
                <li key={index}>{service}</li>
              ))}
            </ul>
          </div>

          <h3>Tổng giá: {formatCurrency(totalPrice)} VND</h3>

          <button type="submit" className="booking-btn">
            Đặt tiệc
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
