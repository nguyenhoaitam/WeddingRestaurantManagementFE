import { useEffect, useState } from "react";
import { Button, Card, Col, Pagination, Row } from "react-bootstrap";
import "./Service.css";
import APIs, { endpoints } from "../../configs/APIs";
import { formatCurrency } from "../Base/Base"

const Service = () => {
  const [services, setServices] = useState([]);
  const [q, setQ] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [currentServicePage, setCurrentServicePage] = useState(1);
  const [totalServicePages, setTotalServicePages] = useState(1);

  useEffect(() => {
    fetchServices();
  }, [sortOrder, q, currentServicePage]);

  const fetchServices = async () => {
    try {
      const params = { order_by: sortOrder, q, page: currentServicePage };
      const response = await APIs.get(endpoints["services"], { params });
      setServices(response.data.results);
      setTotalServicePages(response.data.total_pages);
    } catch (error) {
      console.error("Lỗi khi lấy tất cả dịch vụ:", error);
    }
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  const handleSearch = (e) => {
    setQ(e.target.value);
    fetchServices(sortOrder, e.target.value, currentServicePage);
  };

  const handleServicePageChange = (newPage) => {
    setCurrentServicePage(newPage);
  };

  return (
    <div className="service-container">
      <div className="service-section">
        <div className="search-container">
          <input
            type="text"
            placeholder="Tìm kiếm dịch vụ"
            value={q}
            onChange={handleSearch}
            className="search-input"
          />
        </div>

        <div className="sort-service">
          <select
            className="sort-select"
            value={sortOrder}
            onChange={handleSortChange}
          >
            <option value="">Không sắp xếp</option>
            <option value="asc">Xếp theo: Giá tăng dần</option>
            <option value="desc">Xếp theo: Giá giảm dần</option>
          </select>
        </div>
        <Row className="service-list">
          {services.length > 0 ? (
            services.map((service) => (
              <Col key={service.id} md={4} className="mb-3">
                <Card>
                  <Card.Img
                    variant="top"
                    src={service.image || "placeholder.jpg"}
                  />
                  <Card.Body>
                    <Card.Title>{service.name}</Card.Title>
                    <Card.Text>Giá: {formatCurrency(service.price)}</Card.Text>
                    <Button
                      variant="primary"
                      className="service-btn"
                    >
                      Chọn dịch vụ
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <p className="text-center">Không có dịch vụ nào.</p>
          )}
        </Row>

        <Pagination className="justify-content-center">
          <Pagination.First onClick={() => handleServicePageChange(1)} />
          <Pagination.Prev
            onClick={() =>
              handleServicePageChange(Math.max(currentServicePage - 1, 1))
            }
          />
          {Array.from({ length: totalServicePages }, (_, index) => (
            <Pagination.Item
              key={index + 1}
              active={index + 1 === currentServicePage}
              onClick={() => handleServicePageChange(index + 1)}
            >
              {index + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next
            onClick={() =>
              handleServicePageChange(
                Math.min(currentServicePage + 1, totalServicePages)
              )
            }
          />
          <Pagination.Last
            onClick={() => handleServicePageChange(totalServicePages)}
          />
        </Pagination>
      </div>
    </div>
  );
};

export default Service;
