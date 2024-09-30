import React, { useContext, useEffect, useState } from "react";
import "./Booking.css";
import { BsArrowRightCircleFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import APIs, { authApi, endpoints } from "../../configs/APIs";
import { formatCurrency, formatDate } from "../Base/Base";

const Booking = () => {
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
  const [totalFoodItems, setTotalFoodItems] = useState(0);
  const [totalDrinkItems, setTotalDrinkItems] = useState(0);
  const [totalServiceItems, setTotalServiceItems] = useState(0);
  const [hallPrice, setHallPrice] = useState(0);
  const [token, setToken] = useState(null);

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    customer_id: "",
    customer_name: "",
    customer_phone: "",
    customer_email: "",
    name: "",
    description: "",
    table_quantity: "",
    wedding_hall: "",
    rental_date: "",
    time_of_day: "",
    payment_method: "",
    selectedFoods: [],
    selectedDrinks: [],
    selectedServices: [],
    drinkQuantities: "",
  });

  //   useEffect(() => {
  //     const storedData = localStorage.getItem("bookingFormData");
  //     if (storedData) {
  //         setFormData(JSON.parse(storedData));
  //     }
  // }, []);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const storedToken = localStorage.getItem("token");
        if (!storedToken) {
          navigate("/login");
        } else {
          setToken(storedToken);
        }
      } catch (error) {
        alert("Không thể lấy tài nguyên");
      }
    };

    fetchToken();
  }, [navigate]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        if (token) {
          const userResponse = await authApi(token).get(
            endpoints["current_user"]
          );

          setFormData((prevData) => ({
            ...prevData,
            customer_id: userResponse.data.customer.user_id,
            customer_name: userResponse.data.customer.full_name,
            customer_phone: userResponse.data.phone,
            customer_email: userResponse.data.email,
          }));
        }
      } catch (error) {
        console.error("Lỗi khi tải người dùng:", error);
        alert("Không thể lấy thông tin người dùng");
      }
    };

    fetchUserProfile();
  }, [token]);

  const fetchHallPrice = async () => {
    const { wedding_hall, time_of_day, rental_date } = formData;
    if (wedding_hall && time_of_day && rental_date) {
      try {
        const response = await APIs.get(
          `${endpoints["wedding_hall_prices"]}?hall_id=${wedding_hall}&time_of_day=${time_of_day}&event_date=${rental_date}`
        );
        setHallPrice(response.data[0].price);
      } catch (error) {
        console.error("Lỗi khi lấy giá sảnh:", error);
      }
    }
  };

  useEffect(() => {
    fetchHallPrice();
  }, [formData.wedding_hall, formData.time_of_day, formData.rental_date]);

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
        setTotalFoodItems(foodResponse.data.count);

        setDrinks(drinkResponse.data.results);
        setTotalDrinkItems(drinkResponse.data.count);

        setServices(serviceResponse.data.results);
        setTotalServiceItems(serviceResponse.data.count);

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

  useEffect(() => {
    calculateTotalPrice();
  }, [
    formData.selectedFoods,
    formData.selectedDrinks,
    formData.selectedServices,
    formData.table_quantity,
    formData.drinkQuantities,
  ]);

  const handleCheckboxChange = (e) => {
    const { name, value, checked } = e.target;
    const updatedList = checked
      ? [...formData[name], value]
      : formData[name].filter((item) => item !== value);

    setFormData({
      ...formData,
      [name]: updatedList,
    });
  };

  const handleFoodTypeChange = async (e) => {
    const typeId = e.target.value;
    setSelectedFoodType(typeId);
    setFoodPage(1);
    const response = await APIs.get(
      `${endpoints["foods"]}?foodtype_id=${typeId}&page=1`
    );
    setTotalFoodItems(response.data.count);
    setFoods(response.data.results);
    calculateTotalPrice(formData.selectedFoods, "selectedFoods");
  };

  const loadMoreFoods = async () => {
    if (foods.length >= totalFoodItems) return;

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
    if (drinks.length >= totalDrinkItems) return;

    setLoadingMoreDrinks(true);
    const response = await APIs.get(
      `${endpoints["drinks"]}?page=${drinkPage + 1}`
    );
    setDrinks([...drinks, ...response.data.results]);
    setDrinkPage(drinkPage + 1);
    setLoadingMoreDrinks(false);
  };

  const loadMoreServices = async () => {
    if (services.length >= totalServiceItems) return;

    setLoadingMoreServices(true);
    const response = await APIs.get(
      `${endpoints["services"]}?page=${servicePage + 1}`
    );
    setServices([...services, ...response.data.results]);
    setServicePage(servicePage + 1);
    setLoadingMoreServices(false);
  };

  const calculateTotalPrice = () => {
    let total = 0;

    const tableQuantity = parseInt(formData.table_quantity) || 1;

    formData.selectedFoods.forEach((foodName) => {
      const food = foods.find((food) => food.name === foodName);
      if (food) {
        total += food.price * tableQuantity;
      }
    });

    formData.selectedDrinks.forEach((drinkName) => {
      const drink = drinks.find((drink) => drink.name === drinkName);
      if (drink) {
        const quantity = formData.drinkQuantities[drinkName] || 1;
        total += drink.price * quantity;
      }
    });

    formData.selectedServices.forEach((serviceName) => {
      const service = services.find((service) => service.name === serviceName);
      if (service) {
        total += service.price;
      }
    });

    total += hallPrice;

    setTotalPrice(total);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.wedding_hall ||
      !formData.rental_date ||
      !formData.time_of_day ||
      formData.selectedFoods.length < 5
    ) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    if (formData.selectedFoods.length < 5) {
      alert("Vui lòng chọn ít nhất 5 món ăn!");
      return;
    }

    const rentalDate = new Date(formData.rental_date);
    const currentDate = new Date();

    if (rentalDate < currentDate) {
      alert("Ngày đặt tiệc không hợp lệ. Vui lòng chọn lại ngày!");
      return;
    }

    const response = await APIs.get(endpoints["check_booking_status"], {
      params: {
        rental_date: formData.rental_date,
        time_of_day: formData.time_of_day,
        wedding_hall_id: formData.wedding_hall,
      },
    });

    if (response.data.is_booked) {
      alert(
        `Sảnh bạn chọn đã có tiệc vào buổi "${
          formData.time_of_day
        }" ngày "${formatDate(
          formData.rental_date
        )}"!\nVui lòng chọn lại sảnh hoặc thời gian khác!`
      );
      return;
    }

    const bookingData = {
      customer_name: formData.customer_name,
      customer_phone: formData.customer_phone,
      customer_email: formData.customer_email,
      name: formData.name,
      description: formData.description,
      table_quantity: parseInt(formData.table_quantity),
      rental_date: formData.rental_date,
      time_of_day: formData.time_of_day,
      total_price: totalPrice,
      wedding_hall: formData.wedding_hall,
      customer: formData.customer_id,
      event_type: formData.event_type,
      foods: formData.selectedFoods.map((foodName) => {
        const food = foods.find((food) => food.name === foodName);
        return {
          food: food ? food.id : null,
          quantity: parseInt(formData.table_quantity),
        };
      }),
      drinks: formData.selectedDrinks.map((drinkName) => {
        const drink = drinks.find((drink) => drink.name === drinkName);
        return {
          drink: drink ? drink.id : null,
          quantity: formData.drinkQuantities[drinkName] || 1,
        };
      }),
      services: formData.selectedServices.map((serviceName) => {
        const service = services.find(
          (service) => service.name === serviceName
        );
        return {
          service: service ? service.id : null,
          quantity: 1,
        };
      }),
    };

    // localStorage.setItem("bookingFormData", JSON.stringify(formData));

    navigate("/payment", {
      state: {
        bookingData,
        totalPrice,
      },
    });
  };

  const handleDrinkQuantityChange = (e, drinkName) => {
    const quantity = parseInt(e.target.value) || 1;
    setFormData((prevData) => ({
      ...prevData,
      drinkQuantities: {
        ...prevData.drinkQuantities,
        [drinkName]: quantity,
      },
    }));

    calculateTotalPrice();
  };

  return (
    <div className="booking-page">
      <h2 className="text-center">Đặt Tiệc</h2>
      <div className="booking-container">
        <div className="left-section">
          <div className="customer-info">
            <h4>Thông tin khách hàng</h4>
            <form>
              <div className="form-group">
                <label htmlFor="customer_name">Họ và tên</label>
                <input
                  type="text"
                  id="customer_name"
                  name="customer_name"
                  value={formData.customer_name}
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
                  value={formData.customer_phone}
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
                  value={formData.customer_email}
                  required
                  onChange={handleChange}
                />
              </div>
            </form>
          </div>
          <form onSubmit={handleSubmit}>
            <h4>Thông tin bữa tiệc</h4>
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
                min="1"
                id="table_quantity"
                name="table_quantity"
                value={formData.table_quantity}
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
                <option value="Trưa">Buổi trưa</option>
                <option value="Tối">Buổi tối</option>
              </select>
            </div>
          </form>
        </div>

        <div className="right-section">
          <h4>Thông tin thực đơn</h4>
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
                    <div className="booking-food-item-choose">
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
                  <div className="booking-drink-item-choose">
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
                      {drink.name} - Giá: {formatCurrency(drink.price)} /{" "}
                      {drink.unit}
                    </p>
                  </div>
                  <input
                    type="number"
                    min="1"
                    value={formData.drinkQuantities?.[drink.name] || 1}
                    onChange={(e) => handleDrinkQuantityChange(e, drink.name)}
                    placeholder="Số lượng"
                    className="input-quantity"
                  />
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
        </div>
      </div>
      <h3>Thực đơn và dịch vụ:</h3>
      <div className="selected-items">
        <div className="selected-foods">
          <ul>
            <li className="total-select text-center">Thức ăn</li>
            {formData.selectedFoods.map((food, index) => (
              <li key={index}>{food}</li>
            ))}
          </ul>
        </div>
        <div className="selected-drinks">
          <ul>
            <li className="total-select text-center">Nước uống</li>
            {formData.selectedDrinks.map((drink, index) => (
              <li key={index}>{drink}</li>
            ))}
          </ul>
        </div>
        <div className="selected-services">
          <ul>
            <li className="total-select text-center">Dịch vụ</li>
            {formData.selectedServices.map((service, index) => (
              <li key={index}>{service}</li>
            ))}
          </ul>
        </div>
      </div>
      <p className="hall-price">Giá sảnh: {formatCurrency(hallPrice)}</p>

      <h3>Tổng cộng: {formatCurrency(totalPrice)}</h3>

      <div className="booking-btn-container">
        <button type="submit" className="booking-btn" onClick={handleSubmit}>
          Tiếp tục <BsArrowRightCircleFill />
        </button>
      </div>
    </div>
  );
};

export default Booking;
