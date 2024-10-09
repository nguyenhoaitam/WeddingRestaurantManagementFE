import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Container,
  Button,
  Table,
  Spinner,
  Modal,
  Form,
} from "react-bootstrap";
import APIs, { authApi, endpoints } from "../../configs/APIs";
import "./BookingList.css";
import { formatCurrency, formatDate } from "../Base/Base";
import { FaEdit } from "react-icons/fa";

const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [foods, setFoods] = useState([]);
  const [drinks, setDrinks] = useState([]);
  const [services, setServices] = useState([]);
  const [eventTypes, setEventTypes] = useState("");
  const [hall, setHall] = useState("");
  const [staff, setStaff] = useState("");
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [user, setUser] = useState(null);

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

  const fetchBookings = async () => {
    try {
      const response = await APIs.get(endpoints.booking);
      setBookings(response.data);

      const eventTypeResponse = await APIs.get(endpoints.event_types);
      const staffResponse = await APIs.get(endpoints.staff);
      const hallResponse = await APIs.get(endpoints.wedding_halls);

      const foodData = await fetchFoodData();
      const drinkData = await fetchDrinkData();
      const serviceData = await fetchServiceData();

      setFoods(foodData);
      setDrinks(drinkData);
      setServices(serviceData);
      setEventTypes(eventTypeResponse.data);
      setStaff(staffResponse.data);
      setHall(hallResponse.data);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu tiệc:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const userResponse = await authApi(token).get(endpoints["current_user"]);
      setUser(userResponse.data);
    } catch (error) {
      console.error("Lỗi khi lấy thông tin người dùng:", error);
    }
  };

  useEffect(() => {
    fetchBookings();
    fetchUser();
  }, []);

  const handleShowDetails = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedBooking(null);
    setSelectedStaff(null);
  };

  if (loading) {
    return (
      <div className="text-center">
        <Spinner animation="border" />
      </div>
    );
  }

  const findNameById = (items, id) => {
    const item = items.find((item) => item.id === id);
    return item ? item.name : "Không tìm thấy";
  };

  const findStaffByUserId = (items, userId) => {
    const item = items.find((item) => item.user === userId);
    return item ? item.full_name : "Không tìm thấy";
  };

  const updateBookingStatus = async (bookingId) => {
    const confirmed = window.confirm(
      "Bạn có chắc chắn muốn cập nhật trạng thái thanh toán thành 'Đã thanh toán'?"
    );

    if (confirmed) {
      try {
        const response = await APIs.patch(`${endpoints.booking}${bookingId}/`, {
          payment_status: "Đã thanh toán",
        });

        if (response.status === 200) {
          alert("Trạng thái đã được cập nhật!");
          fetchBookings();
          handleCloseModal();
        } else {
          alert("Có lỗi xảy ra khi cập nhật trạng thái.");
        }
      } catch (error) {
        console.error("Lỗi khi cập nhật trạng thái:", error);
        alert("Có lỗi xảy ra khi cập nhật trạng thái.");
      }
    } else {
      alert("Cập nhật trạng thái đã bị hủy.");
    }
  };

  const handleAssignStaff = async () => {
    if (!selectedStaff) {
      alert("Vui lòng chọn nhân viên!");
      return;
    }

    try {
      const response = await APIs.patch(
        `${endpoints.booking}${selectedBooking.id}/`,
        {
          staff: selectedStaff,
        }
      );

      if (response.status === 200) {
        alert("Nhân viên đã được gán thành công!");
        fetchBookings();
        handleCloseModal();
      } else {
        alert("Có lỗi xảy ra, không thể gán nhân viên.");
      }
    } catch (error) {
      console.error("Lỗi khi gán nhân viên:", error);
      alert("Có lỗi xảy ra khi gán nhân viên.");
    }
  };

  return (
    <>
      <Container className="booking-list-container">
        <h2 className="text-center my-4">Danh sách các tiệc</h2>
        <Row>
          {bookings.map((booking) => (
            <Col key={booking.id} md={6} lg={4}>
              <Card className="mb-4 shadow-sm">
                <Card.Body>
                  <Card.Title className="booking-title">
                    {booking.name}
                  </Card.Title>
                  <Card.Text>
                    <strong>Ngày tổ chức:</strong>{" "}
                    {formatDate(booking.rental_date)}
                  </Card.Text>
                  <Card.Text>
                    <strong>Thời gian trong ngày:</strong> {booking.time_of_day}
                  </Card.Text>
                  <Card.Text>
                    <strong>Số bàn:</strong> {booking.table_quantity}
                  </Card.Text>
                  <Card.Text>
                    <strong>Trạng thái thanh toán:</strong>{" "}
                    {booking.payment_status}
                  </Card.Text>
                  <Card.Text>
                    <strong>Tổng giá:</strong>{" "}
                    {formatCurrency(booking.total_price)}
                  </Card.Text>
                  <Button
                    className="button-primary"
                    onClick={() => handleShowDetails(booking)}
                  >
                    Xem chi tiết
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

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
          <Modal.Body className="booking-modal-header">
            <p>Tên bữa tiệc: {selectedBooking.name}</p>
            <p>Mô tả: {selectedBooking.description}</p>
            <p>Sảnh: {findNameById(hall, selectedBooking.wedding_hall)}</p>
            <p>Số lượng bàn: {selectedBooking.table_quantity}</p>
            <p>Ngày đặt: {formatDate(selectedBooking.created_date)}</p>
            <p>Ngày tổ chức: {formatDate(selectedBooking.rental_date)}</p>
            <p>Buổi tổ chức: {selectedBooking.time_of_day}</p>
            <p>Phương thức thanh toán: {selectedBooking.payment_method}</p>
            <p>
              Trạng thái thanh toán: {selectedBooking.payment_status}
              {selectedBooking.payment_status === "Chờ thanh toán" && (
                <FaEdit
                  onClick={() => updateBookingStatus(selectedBooking.id)}
                  style={{
                    cursor: "pointer",
                    color: "blue",
                    marginLeft: "10px",
                  }}
                  title="Chỉnh sửa trạng thái thành 'Đã thanh toán'"
                />
              )}
            </p>
            <p>
              Loại sự kiện:{" "}
              {findNameById(eventTypes, selectedBooking.event_type)}
            </p>
            <p>Tổng tiền: {formatCurrency(selectedBooking.total_price)}</p>
            <p>
              Nhân viên hổ trợ:{" "}
              {selectedBooking.staff
                ? findStaffByUserId(staff, selectedBooking.staff)
                : "Chưa có nhân viên hỗ trợ"}
            </p>

            {!selectedBooking.staff && user?.user_role === "admin" && (
              <div>
                <Form.Group>
                  <Form.Label>Chọn nhân viên hỗ trợ:</Form.Label>
                  <Form.Control
                    as="select"
                    value={selectedStaff || ""}
                    onChange={(e) => setSelectedStaff(e.target.value)}
                  >
                    <option value="">Chọn nhân viên</option>
                    {staff.map((s) => (
                      <option key={s.id} value={s.user}>
                        {s.full_name}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
                <Button
                  variant="primary"
                  className="mt-3 button-primary btn-assign-staff"
                  onClick={handleAssignStaff}
                >
                  Gán nhân viên
                </Button>
              </div>
            )}
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

            <p>Nước uống:</p>
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
                </tr>
              </thead>
              <tbody>
                {selectedBooking.services.map((service) => (
                  <tr key={service.service}>
                    <td>{findNameById(services, service.service)}</td>
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
    </>
  );
};

export default BookingList;
