import React, { useState, useEffect } from "react";
import { Card, Row, Col, Container, Button } from "react-bootstrap";
import APIs, { endpoints } from "../../configs/APIs";
import "./FeedbackReview.css";
import { formatDate } from "../Base/Base";

const FeedbackReview = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [booking, setBooking] = useState("")

  const fetchFeedbacks = async (pageNum) => {
    try {
      setIsLoading(true);
      const response = await APIs.get(`${endpoints.feedback}?page=${pageNum}`);
      const newFeedbacks = response.data.results;

      setFeedbacks((prevFeedbacks) => {
        const allFeedbacks = [...prevFeedbacks, ...newFeedbacks];
        const uniqueFeedbacks = allFeedbacks.filter(
          (feedback, index, self) =>
            index === self.findIndex((f) => f.id === feedback.id)
        );
        return uniqueFeedbacks;
      });

      setHasMore(response.data.next !== null);
    } catch (error) {
      console.error("Lỗi khi tải đánh giá:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks(page);
  }, [page]);

  const loadMoreFeedbacks = () => {
    if (!isLoading && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const fetchBookings = async () => {
    try {
      const res = await APIs.get(endpoints.booking)
      setBooking(res.data)
    }
    catch (error) {
      console.error("Lỗi khi tải dữ liệu: " + error)
    }
  }

  useEffect(() => {
    fetchBookings();
  }, []);

  const findNameById = (items, id) => {
    if (!items || items.length === 0) return "Không tìm thấy";
    const item = items.find((item) => item.id === id);
    return item ? item.name : "Không tìm thấy";
  };
  

  return (
    <Container className="feedback-rv-container">
      <h2 className="text-center my-4">Đánh giá của khách hàng về tiệc</h2>
      <Row>
        {feedbacks.map((feedback) => (
          <Col key={feedback.id} md={6}>
            <Card className="feedback-card mb-4 shadow-sm">
              <Card.Body>
                <Card.Title className="feedback-title">
                  Khách hàng: {feedback.customer.full_name}
                </Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  Đánh giá: {feedback.rating}/5
                </Card.Subtitle>
                <Card.Text>Nội dung: {feedback.content}</Card.Text>
                <Card.Text>Bữa tiệc: {findNameById(booking, feedback.wedding_booking)}</Card.Text>
                <Card.Footer className="text-muted">
                  Ngày đánh giá: {formatDate(feedback.created_date)} || Cập nhật{" "}
                  {formatDate(feedback.updated_date)}
                </Card.Footer>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {hasMore && (
        <div className="text-center">
          <Button
            onClick={loadMoreFeedbacks}
            disabled={isLoading}
            className="load-more-btn mt-3"
          >
            {isLoading ? "Đang tải..." : "Tải thêm"}
          </Button>
        </div>
      )}
    </Container>
  );
};

export default FeedbackReview;
