import React, { useEffect, useState } from "react";
import { Card, Button, Modal, Spinner, Table } from "react-bootstrap";
import APIs, { endpoints } from "../../configs/APIs";
import { useContext } from "react";
import { MyUserContext } from "../../configs/Contexts";
import "./CustomerBooking.css";

const CustomerBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const user = useContext(MyUserContext);
  const [foods, setFoods] = useState([]);
  const [drinks, setDrinks] = useState([]);
  const [services, setServices] = useState([]);
  const [eventTypes, setEventTypes] = useState("");

  const fetchFoodData = async (page = 1) => {
    try {
      const response = await APIs.get(`${endpoints.foods}?page=${page}`);
      return response.data.results;
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu thức ăn:", error);
      return [];
    }
  };

  const fetchDrinkData = async (page = 1) => {
    try {
      const response = await APIs.get(`${endpoints.drinks}?page=${page}`);
      return response.data.results;
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu đồ uống:", error);
      return [];
    }
  };

  const fetchServiceData = async (page = 1) => {
    try {
      const response = await APIs.get(`${endpoints.services}?page=${page}`);
      return response.data.results;
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu dịch vụ:", error);
      return [];
    }
  };

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await APIs.get(endpoints.customer_booking(user.id), {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBookings(res.data);

        const eventTypeResponse = await APIs.get(endpoints.event_types);

        const foodData = await fetchFoodData();
        const drinkData = await fetchDrinkData();
        const serviceData = await fetchServiceData();

        setFoods(foodData);
        setDrinks(drinkData);
        setServices(serviceData);
        setEventTypes(eventTypeResponse.data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách đặt tiệc:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user && user.id) {
      fetchBookings();
    }
  }, [user]);

  const handleShowDetails = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedBooking(null);
  };

  if (loading) {
    return (
      <div className="text-center">
        <Spinner animation="border" />
      </div>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  const findNameById = (items, id) => {
    const item = items.find((item) => item.id === id);
    return item ? item.name : "Không tìm thấy";
  };

  return (
    <div className="c-booking-container">
      <h1>Danh sách đơn đặt tiệc của tôi</h1>
      <div className="row">
        {bookings.map((booking) => (
          <div key={booking.id}>
            <Card>
              <Card.Header className="text-center" as="h5">
                #{booking.id}
              </Card.Header>
              <Card.Body>
                <Card.Title>{booking.name}</Card.Title>
                <Card.Text>
                  <p>Số lượng bàn: {booking.table_quantity}</p>
                  <p>Ngày tổ chức: {formatDate(booking.rental_date)}</p>
                  <p>Tổng giá: {booking.total_price.toLocaleString()} VND</p>
                  <p>
                    Trạng thái thanh toán: {booking.payment_status || "Chưa có"}{" "}
                  </p>
                </Card.Text>
                <Button
                  className="button-primary"
                  onClick={() => handleShowDetails(booking)}
                >
                  Xem chi tiết
                </Button>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>

      {selectedBooking && (
        <Modal
          size="lg"
          className="booking-modal"
          show={showModal}
          onHide={handleCloseModal}
        >
          <Modal.Header closeButton className="modal-header">
            <Modal.Title>Chi tiết đơn đặt tiệc</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Tên: {selectedBooking.name}</p>
            <p>Mô tả: {selectedBooking.description}</p>
            <p>Số lượng bàn: {selectedBooking.table_quantity}</p>
            <p>Ngày tổ chức: {formatDate(selectedBooking.rental_date)}</p>
            <p>Tổng giá: {selectedBooking.total_price.toLocaleString()} VND</p>
            <p>Phương thức thanh toán: {selectedBooking.payment_method}</p>
            <p>Trạng thái thanh toán: {selectedBooking.payment_status}</p>
            <p>
              Ngày đặt:{" "}
              {new Date(selectedBooking.created_date).toLocaleString()}
            </p>
            <p>
              Loại sự kiện:{" "}
              {findNameById(eventTypes, selectedBooking.event_type)}
            </p>
            <p>Khách hàng: {user.customer.full_name}</p>

            <p>Thức ăn:</p>
            <Table striped bordered hover>
              <thead className="b-table-header">
                <tr>
                  <th>Tên</th>
                  <th>Số lượng</th>
                </tr>
              </thead>
              <tbody>
                {selectedBooking.foods.map((food) => (
                  <tr key={food.food}>
                    <td>{findNameById(foods, food.food)}</td>
                    <td>{food.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </Table>

            <p>Đồ uống:</p>
            <Table striped bordered hover>
              <thead className="b-table-header">
                <tr>
                  <th>Tên</th>
                  <th>Số lượng</th>
                </tr>
              </thead>
              <tbody>
                {selectedBooking.drinks.map((drink) => (
                  <tr key={drink.drink}>
                    <td>{findNameById(drinks, drink.drink)}</td>
                    <td>{drink.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </Table>

            <p>Dịch vụ:</p>
            <Table striped bordered hover>
              <thead className="b-table-header">
                <tr>
                  <th>Tên</th>
                  <th>Số lượng</th>
                </tr>
              </thead>
              <tbody>
                {selectedBooking.services.map((service) => (
                  <tr key={service.service}>
                    <td>{findNameById(services, service.service)}</td>
                    <td>{service.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Đóng
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default CustomerBooking;
