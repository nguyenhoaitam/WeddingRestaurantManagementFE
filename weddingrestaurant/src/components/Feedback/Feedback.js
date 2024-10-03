import React, { useContext, useEffect, useState } from "react";
import { Modal, Button, Form, Card } from "react-bootstrap";
import "./Feedback.css";
import APIs, { endpoints } from "../../configs/APIs";
import { MyUserContext } from "../../configs/Contexts";
import { formatDate, formatCurrency } from "../Base/Base";
import { useNavigate } from "react-router-dom";

const Feedback = () => {
  const user = useContext(MyUserContext);
  const [bookings, setBookings] = useState([]);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(1);
  const [feedbackId, setFeedbackId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const navigate = useNavigate();

  const fetchToken = async () => {
    try {
      const storedToken = localStorage.getItem("token");
      if (!storedToken) {
        navigate("/login");
      }
    } catch (error) {
      alert("Không thể lấy tài nguyên");
    }
  };

  useEffect(() => {
    fetchToken();
  }, [navigate]);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await APIs.get(endpoints.customer_booking(user.id), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBookings(res.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách đặt tiệc:", error);
    }
  };

  const fetchFeedback = async (bookingId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await APIs.get(
        `${endpoints.booking}${bookingId}/feedbacks/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(res.data);
      if (res.data.length > 0) {
        const feedback = res.data[0];
        setContent(feedback.content);
        setRating(feedback.rating);
        setFeedbackId(feedback.id);
      } else {
        setContent("");
        setRating(1);
        setFeedbackId(null);
      }
    } catch (error) {
      console.error("Lỗi khi lấy đánh giá:", error);
    }
  };

  useEffect(() => {
    if (user && user.id) {
      fetchBookings();
    }
  }, [user]);

  const openFeedbackModal = async (bookingId) => {
    setSelectedBookingId(bookingId);
    await fetchFeedback(bookingId);
  };

  const closeFeedbackModal = () => {
    setSelectedBookingId(null);
    setFeedbackId(null);
    setContent("");
    setRating(1);
    setShowDeleteConfirm(false);
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    const formData = new FormData();

    if (!selectedBookingId) {
      alert("Vui lòng chọn một đặt tiệc để gửi đánh giá.");
      return;
    }

    if (!content) {
      alert("Vui lòng nhập nội dung đánh giá.");
      return;
    }

    formData.append("content", content);
    formData.append("rating", rating);
    formData.append("wedding_booking", selectedBookingId);

    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }

    try {
      if (feedbackId) {
        const response = await APIs.put(
          endpoints.feedback_detail(feedbackId),
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        alert("Đánh giá của bạn đã được cập nhật!");
      } else {
        const response = await APIs.post(endpoints.feedback, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        alert("Đánh giá của bạn đã được gửi!");
      }
      closeFeedbackModal();
      await fetchBookings();
    } catch (error) {
      console.error(
        "Lỗi khi gửi hoặc cập nhật đánh giá:",
        error.response ? error.response.data : error.message
      );
      alert("Có lỗi xảy ra. Vui lòng thử lại.");
    }
  };

  const handleDelete = async () => {
    if (!feedbackId) return;

    const token = localStorage.getItem("token");
    try {
      await APIs.delete(endpoints.feedback_detail(feedbackId), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Đánh giá của bạn đã được xóa!");
      closeFeedbackModal();
      await fetchBookings();
    } catch (error) {
      console.error(
        "Lỗi khi xóa đánh giá:",
        error.response ? error.response.data : error.message
      );
      alert("Có lỗi xảy ra. Vui lòng thử lại.");
    }
  };

  const confirmDelete = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    handleDelete();
    setShowDeleteConfirm(false);
  };

  return (
    <div className="feedback-container">
      <h3 className="text-center feedback-title">Đánh giá bữa tiệc đã đặt</h3>
      {bookings.map((booking) => (
        <Card key={booking.id} className="text-center">
          <Card.Header as="h5">{booking.name}</Card.Header>
          <Card.Body>
            <Card.Title>
              Tổng giá: {formatCurrency(booking.total_price)}
            </Card.Title>
            <Card.Text>
              Ngày tổ chức: {formatDate(booking.rental_date)}
            </Card.Text>
            <Button
              className="feedback-btn"
              onClick={() => openFeedbackModal(booking.id)}
            >
              {feedbackId && selectedBookingId === booking.id
                ? "Xem đánh giá"
                : "Đánh giá"}
            </Button>
          </Card.Body>
        </Card>
      ))}

      {selectedBookingId && (
        <Modal show={true} onHide={closeFeedbackModal}>
          <Modal.Header closeButton>
            <Modal.Title>Đánh giá bữa tiệc</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="feedbackContent">
                <Form.Label>Nội dung đánh giá:</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Nhập phản hồi của bạn..."
                />
              </Form.Group>
              <Form.Group controlId="feedbackRating">
                <Form.Label>Đánh giá</Form.Label>
                <Form.Control
                  as="select"
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                >
                  <option value={1}>★ (Rất tệ)</option>
                  <option value={2}>★ ★ (Tệ)</option>
                  <option value={3}>★ ★ ★ (Bình thường)</option>
                  <option value={4}>★ ★ ★ ★ (Tốt)</option>
                  <option value={5}>★ ★ ★ ★ ★ (Rất tốt)</option>
                </Form.Control>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            {feedbackId && (
              <>
                <Button variant="danger" onClick={confirmDelete}>
                  Xóa đánh giá
                </Button>
              </>
            )}
            <Button
              variant="secondary close_fb_btn"
              onClick={closeFeedbackModal}
            >
              Đóng
            </Button>
            <Button
              className="md-feedback-btn"
              variant="primary"
              onClick={handleSubmit}
            >
              {feedbackId ? "Cập nhật đánh giá" : "Gửi đánh giá"}
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      <Modal
        show={showDeleteConfirm}
        onHide={() => setShowDeleteConfirm(false)}
      >
        <Modal.Header closeButton className="header-comfirm-delete">
          <Modal.Title>Xác nhận xóa đánh giá</Modal.Title>
        </Modal.Header>
        <Modal.Body>Bạn có chắc chắn muốn xóa đánh giá này không?</Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowDeleteConfirm(false)}
          >
            Hủy
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Xóa
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Feedback;
