import { useEffect, useState } from "react";
import { Button, Card, Col, Row, Tab, Tabs } from "react-bootstrap";
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

  const fetchAllFoods = async (order = "") => {
    try {
      const params = { order_by: order };
      if (selectedFoodTypeId) {
        params.foodtype_id = selectedFoodTypeId;
      }
      const response = await APIs.get(endpoints["foods"], { params });
      setFoods(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy tất cả món ăn:", error);
    }
  };

  const handleFoodTypeSelect = async (foodTypeId) => {
    try {
      const response = await APIs.get(
        `${endpoints.foods}?foodtype_id=${foodTypeId}`
      );
      setSelectedFoodTypeId(foodTypeId);
      setSortOrder("");
      setFoods(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy món ăn:", error);
    }
  };

  const handleSortChange = (e) => {
    const selectedOrder = e.target.value;
    setSortOrder(selectedOrder);
    fetchAllFoods(selectedOrder);
  };

  const fetchDrinks = async (order = "") => {
    try {
      const params = { order_by: order };
      const response = await APIs.get(endpoints["drinks"], { params });
      setDrinks(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy tất cả nước uống:", error);
    }
  };

  useEffect(() => {
    fetchDrinks();
  }, []);

  const handleDrinkSortChange = (e) => {
    const selectedOrder = e.target.value;
    setDrinkSortOrder(selectedOrder);
    fetchDrinks(selectedOrder);
  };

  return (
    <div className="menu-container">
      <Tabs
        defaultActiveKey="food"
        id="fill-tab-example"
        className="mb-3"
        fill
        activeKey={key}
        onSelect={(k) => setKey(k)}
      >
        <Tab eventKey="food" title="Món ăn">
          <div className="food-section">
            <div className="food-type-container">
              <Button
                onClick={() => {
                  setSelectedFoodTypeId(null);
                  fetchAllFoods(sortOrder);
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
                      <Card.Body>
                        <Card.Title>{food.name}</Card.Title>
                        {/* <Card.Text>{food.description}</Card.Text> */}
                        <Card.Text>Giá: {formatCurrency(food.price)}</Card.Text>
                        <Button variant="primary">Chọn món</Button>
                      </Card.Body>
                    </Card>
                  </Col>
                ))
              ) : (
                <p className="text-center">Chưa có món ăn nào được chọn.</p>
              )}
            </Row>
          </div>
        </Tab>
        <Tab eventKey="drink" title="Nước uống">
          <div className="drink-section">
            <div className="sort-drink">
              <select
                className="sort-select"
                value={drinkSortOrder}
                onChange={handleDrinkSortChange} // Xử lý sự kiện thay đổi sắp xếp
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
                          <Button variant="primary">Chọn nước</Button>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))
                ) : (
                  <p className="text-center">
                    Chưa có nước uống nào được chọn.
                  </p>
                )}
              </Row>
            </div>
          </div>
        </Tab>
      </Tabs>
    </div>
  );
};

export default Menu;
