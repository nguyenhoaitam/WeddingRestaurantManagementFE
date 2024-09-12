import { useEffect, useState } from "react";
import { Button, Card, Col, Pagination, Row, Tab, Tabs } from "react-bootstrap";
import "./Menu.css";
import APIs, { endpoints } from "../../configs/APIs";

const formatCurrency = (value) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
};

const Menu = () => {
  const [key, setKey] = useState("food");
  const [foodTypes, setFoodTypes] = useState([]);
  const [foods, setFoods] = useState([]);
  const [drinks, setDrinks] = useState([]);
  const [sortOrder, setSortOrder] = useState("");
  const [selectedFoodTypeId, setSelectedFoodTypeId] = useState(null);
  const [drinkSortOrder, setDrinkSortOrder] = useState("");
  const [q, setQ] = useState("");

  const [currentFoodPage, setCurrentFoodPage] = useState(1);
  const [totalFoodPages, setTotalFoodPages] = useState(1);

  const [currentDrinkPage, setCurrentDrinkPage] = useState(1);
  const [totalDrinkPages, setTotalDrinkPages] = useState(1);

  useEffect(() => {
    const fetchFoodTypes = async () => {
      try {
        const response = await APIs.get(endpoints["food_types"]);
        setFoodTypes(response.data);
        fetchAllFoods();
      } catch (error) {
        console.error("Lỗi khi lấy loại món ăn:", error);
      }
    };

    fetchFoodTypes();
  }, []);

  const fetchAllFoods = async (order = "", q = "", page = 1) => {
    try {
      const params = { order_by: order, q, page };
      if (selectedFoodTypeId) {
        params.foodtype_id = selectedFoodTypeId;
      }
      const response = await APIs.get(endpoints["foods"], { params });
      setFoods(response.data.results);
      setTotalFoodPages(response.data.total_pages);
    } catch (error) {
      console.error("Lỗi khi lấy tất cả món ăn:", error);
    }
  };

  useEffect(() => {
    fetchAllFoods(sortOrder, q, currentFoodPage);
  }, [selectedFoodTypeId, sortOrder, currentFoodPage]);

  const handleFoodTypeSelect = (foodTypeId) => {
    setSelectedFoodTypeId(foodTypeId);
    setSortOrder("");
    setQ("");
    setCurrentFoodPage(1);
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  const fetchDrinks = async (order = "", q = "", page = 1) => {
    try {
      const params = { order_by: order, q, page };
      const response = await APIs.get(endpoints["drinks"], { params });
      setDrinks(response.data.results);
      setTotalDrinkPages(response.data.total_pages);
    } catch (error) {
      console.error("Lỗi khi lấy tất cả nước uống:", error);
    }
  };

  useEffect(() => {
    if (key === "drink") {
      fetchDrinks(drinkSortOrder, q, currentDrinkPage);
    }
  }, [key, drinkSortOrder, currentDrinkPage]);

  const handleDrinkSortChange = (e) => {
    setDrinkSortOrder(e.target.value);
  };

  const handleSearch = (e) => {
    setQ(e.target.value);
    if (key === "food") {
      fetchAllFoods(sortOrder, e.target.value, 1);
    } else {
      fetchDrinks(drinkSortOrder, e.target.value, 1);
    }
  };

  const handleTabSelect = (k) => {
    setKey(k);
    setQ("");
    if (k === "food") {
      setCurrentFoodPage(1);
    } else {
      setCurrentDrinkPage(1);
    }
  };

  const handleFoodPageChange = (newPage) => {
    setCurrentFoodPage(newPage);
  };

  const handleDrinkPageChange = (newPage) => {
    setCurrentDrinkPage(newPage);
  };

  const renderPagination = (currentPage, totalPages, onPageChange) => {
    const items = [];
    for (let number = 1; number <= totalPages; number++) {
      if (number === 1 || number === totalPages || (number >= currentPage - 1 && number <= currentPage + 1)) {
        items.push(
          <Pagination.Item
            key={number}
            active={number === currentPage}
            onClick={() => onPageChange(number)}
          >
            {number}
          </Pagination.Item>
        );
      } else if (items[items.length - 1]?.type !== Pagination.Ellipsis) {
        items.push(<Pagination.Ellipsis key={`ellipsis-${number}`} />);
      }
    }
    return items;
  };

  return (
    <div className="menu-container">
      <Tabs
        defaultActiveKey="food"
        id="fill-tab-example"
        className="mb-3"
        fill
        activeKey={key}
        onSelect={handleTabSelect}
      >
        <Tab eventKey="food" title="Món ăn">
          <div className="food-section">
            <div className="search-container">
              <input
                type="text"
                placeholder="Tìm kiếm món ăn"
                value={q}
                onChange={handleSearch}
                className="search-input"
              />
            </div>

            <div className="food-type-container">
              <Button
                onClick={() => {
                  setSelectedFoodTypeId(null);
                  setSortOrder("");
                  setCurrentFoodPage(1);
                }}
                className="all-foods-button food-type-chip"
              >
                Tất cả
              </Button>
              {foodTypes.map((type) => (
                <Button
                  key={type.id}
                  className="food-type-chip"
                  onClick={() => handleFoodTypeSelect(type.id)}
                >
                  {type.name}
                </Button>
              ))}
            </div>
            <div className="sort-container">
              <p>
                <i>Lưu ý: Giá món ăn được tính trên đơn vị bàn</i>
              </p>
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
            <Row className="food-list">
              {foods.length > 0 ? (
                foods.map((food) => (
                  <Col key={food.id} md={4} className="mb-3">
                    <Card>
                      <Card.Img
                        variant="top"
                        src={food.image || "placeholder.jpg"}
                      />
                      {food.is_vegetarian && (
                          <div className="vegetarian-tag">
                            <span>Ăn chay được</span>
                          </div>
                        )}
                      <Card.Body>
                        <Card.Title>{food.name}</Card.Title>
                        {/* <Card.Text>{food.description}</Card.Text> */}
                        <Card.Text>Giá: {formatCurrency(food.price)}</Card.Text>
                        <Button
                          variant="primary"
                          className="food-type-chip"
                        >
                          Chọn món
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                ))
              ) : (
                <p className="text-center">Không có món ăn nào.</p>
              )}
            </Row>

            <Pagination className="justify-content-center">
              <Pagination.First onClick={() => handleFoodPageChange(1)} />
              <Pagination.Prev
                onClick={() =>
                  handleFoodPageChange(Math.max(currentFoodPage - 1, 1))
                }
              />
              {renderPagination(currentFoodPage, totalFoodPages, handleFoodPageChange)}
              <Pagination.Next
                onClick={() =>
                  handleFoodPageChange(
                    Math.min(currentFoodPage + 1, totalFoodPages)
                  )
                }
              />
              <Pagination.Last
                onClick={() => handleFoodPageChange(totalFoodPages)}
              />
            </Pagination>
          </div>
        </Tab>
        <Tab eventKey="drink" title="Nước uống">
          <div className="drink-section">
            <div className="search-container">
              <input
                type="text"
                placeholder="Tìm kiếm nước uống"
                value={q}
                onChange={handleSearch}
                className="search-input"
              />
            </div>

            <div className="sort-drink">
              <select
                className="sort-select"
                value={drinkSortOrder}
                onChange={handleDrinkSortChange}
              >
                <option value="">Không sắp xếp</option>
                <option value="asc">Xếp theo: Giá tăng dần</option>
                <option value="desc">Xếp theo: Giá giảm dần</option>
              </select>
            </div>
            <div className="drink-list">
              <Row className="drink-list">
                {drinks.length > 0 ? (
                  drinks.map((drink) => (
                    <Col key={drink.id} md={4} className="mb-3">
                      <Card>
                        <Card.Img
                          variant="top"
                          src={drink.image || "placeholder.jpg"}
                        />
                        <Card.Body>
                          <Card.Title>{drink.name}</Card.Title>
                          {/* <Card.Text>{drink.description}</Card.Text> */}
                          <Card.Text>
                            Giá: {formatCurrency(drink.price)}
                          </Card.Text>
                          <Button
                            variant="primary"
                            className="food-type-chip"
                          >
                            Chọn nước
                          </Button>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))
                ) : (
                  <p className="text-center">Không có nước uống nào.</p>
                )}
              </Row>

              <Pagination className="justify-content-center">
                <Pagination.First onClick={() => handleDrinkPageChange(1)} />
                <Pagination.Prev
                  onClick={() =>
                    handleDrinkPageChange(Math.max(currentDrinkPage - 1, 1))
                  }
                />
                {Array.from({ length: totalDrinkPages }, (_, index) => (
                  <Pagination.Item
                    key={index + 1}
                    active={index + 1 === currentDrinkPage}
                    onClick={() => handleDrinkPageChange(index + 1)}
                  >
                    {index + 1}
                  </Pagination.Item>
                ))}
                <Pagination.Next
                  onClick={() =>
                    handleDrinkPageChange(
                      Math.min(currentDrinkPage + 1, totalDrinkPages)
                    )
                  }
                />
                <Pagination.Last
                  onClick={() => handleDrinkPageChange(totalDrinkPages)}
                />
              </Pagination>
            </div>
          </div>
        </Tab>
      </Tabs>
    </div>
  );
};

export default Menu;
