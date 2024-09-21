import React, { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MyUserContext } from "../../configs/Contexts";
import APIs, { endpoints } from "../../configs/APIs";
import "./Payment.css";
import { Button, Spinner, Modal } from "react-bootstrap";
import defaultPaymentImg from "../../assets/images/transaction.png";

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useContext(MyUserContext);
  const [showModal, setShowModal] = useState(false);

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(1);
  const [loading, setLoading] = useState(false);

  // Lấy bookingData và totalPrice từ location.state
  const { bookingData, totalPrice } = location.state || {};

  if (!bookingData || !totalPrice) {
    alert("Dữ liệu thanh toán không hợp lệ. Quay lại trang trước.");
    navigate(-1);
    return null;
  }

  const paymentMethods = [
    {
      id: 1,
      name: "Thanh toán trực tiếp",
      Image:
        "https://res.cloudinary.com/dkmurrwq5/image/upload/v1726383394/4_altbv6.png",
    },
    {
      id: 2,
      name: "Thanh toán chuyển khoản ngân hàng",
      Image:
        "https://res.cloudinary.com/dkmurrwq5/image/upload/v1726383394/QR_n2hbkz.png",
    },
    {
      id: 3,
      name: "Thanh toán với ví MoMo",
      Image:
        "https://res.cloudinary.com/dkmurrwq5/image/upload/v1726154088/Momo_bdtq5a.png",
    },
    {
      id: 4,
      name: "Thanh toán với ví ZaloPay",
      Image:
        "https://res.cloudinary.com/dkmurrwq5/image/upload/v1726154088/ZaloPay_b0fbui.png",
    },
  ];

  const handlePaymentMethodChange = (id) => {
    setSelectedPaymentMethod(id);
  };

  const renderPaymentMethod = (item) => (
    <div
      key={item.id}
      className={`payment-option ${
        selectedPaymentMethod === item.id ? "selected-payment-option" : ""
      }`}
      onClick={() => handlePaymentMethodChange(item.id)}
    >
      <img
        src={item.Image || defaultPaymentImg}
        alt={item.name}
        className="payment-method-icon"
      />
      <p>{item.name}</p>
      {selectedPaymentMethod === item.id && (
        <span className="tick-mark">✔</span>
      )}
    </div>
  );

  const handleMoMoPayment = async () => {
    try {
      const response = await APIs.post(endpoints["momo"], null, {
        headers: { amount: totalPrice.toString() },
      });
      if (response.data.payUrl) {
        window.open(response.data.payUrl, "_blank");
        await handleSubmit(true);
        navigate("/customer_booking");
      } else {
        throw new Error("Lỗi khi tạo đơn hàng MoMo");
      }
    } catch (error) {
      console.error(error);
      alert("Có lỗi xảy ra khi thanh toán MoMo. Vui lòng thử lại sau!");
    }
  };

  const handleZaloPayPayment = async () => {
    try {
      const response = await APIs.post(endpoints["zalo_pay"], null, {
        headers: { amount: totalPrice.toString() },
      });
      if (response.data.order_url) {
        window.open(response.data.order_url, "_blank");
        await handleSubmit(true);
        navigate("/customer_booking");
      } else {
        throw new Error("Lỗi khi tạo đơn hàng ZaloPay");
      }
    } catch (error) {
      console.error(error);
      alert("Có lỗi xảy ra khi thanh toán ZaloPay. Vui lòng thử lại sau!");
    }
  };

  const handlePayment = async () => {
    setLoading(true);
    try {
      switch (selectedPaymentMethod) {
        case 1:
          await handleSubmit(false);
          setShowModal(true);
          navigate("/customer_booking");
          break;
        case 3:
          await handleMoMoPayment();
          break;
        case 4:
          await handleZaloPayPayment();
          break;
        default:
          alert("Phương thức thanh toán chưa được hỗ trợ!");
          break;
      }
    } catch (error) {
      console.error("Lỗi khi thanh toán:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (paymentStatus = false) => {
    setLoading(true);
    try {
      const selectedPaymentMethodObj = paymentMethods.find(
        (method) => method.id === selectedPaymentMethod
      );

      if (!user || !user.id) {
        alert("Bạn cần đăng nhập để đặt tiệc.");
        navigate("/login");
        return;
      }

      const dataToSubmit = {
        name: bookingData.name,
        description: `
            Tên khách hàng: ${bookingData.customer_name},
            Số điện thoại: ${bookingData.customer_phone || "Chưa có số điện thoại"},
            Email: ${bookingData.customer_email || "Chưa có email"},
            Mô tả: ${bookingData.description}
        `,
        table_quantity: bookingData.table_quantity,
        rental_date: bookingData.rental_date,
        time_of_day: bookingData.time_of_day,
        payment_method: selectedPaymentMethodObj.name,
        payment_status: paymentStatus ? "Đã thanh toán" : "Chờ thanh toán",
        total_price: totalPrice,
        wedding_hall: bookingData.wedding_hall,
        customer: user.id,
        event_type: bookingData.event_type,
        foods: bookingData.foods.map((food) => ({
          food: food.food,
          quantity: food.quantity,
        })),
        drinks: bookingData.drinks.map((drink) => ({
          drink: drink.drink,
          quantity: drink.quantity,
        })),
        services: bookingData.services.map((service) => ({
          service: service.service,
          quantity: service.quantity,
        })),
      };

      const res = await APIs.post(endpoints["booking"], dataToSubmit, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.status === 201) {
        alert("Đặt tiệc thành công");
      } else {
        alert("Đăng ký đặt tiệc thất bại. Vui lòng thử lại!");
      }
    } catch (error) {
      console.error("Lỗi khi lưu thông tin đặt tiệc:", error);
      alert("Có lỗi xảy ra khi đăng ký đặt tiệc. Vui lòng thử lại sau!");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    navigate("/");
  };

  return (
    <div className="payment-container">
      <div className="payment">
        <h1>Thanh toán</h1>

        <div className="payment-methods">
          {paymentMethods.map(renderPaymentMethod)}
        </div>

        <div className="confirmation-container">
          <Button variant="primary" onClick={handlePayment} disabled={loading}>
            {loading ? (
              <>
                <Spinner animation="border" size="sm" /> Đang xử lý...
              </>
            ) : (
              "Thanh toán ngay"
            )}
          </Button>
        </div>
      </div>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Hướng dẫn thanh toán</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Cảm ơn quý khách hàng đã tin tưởng và lựa chọn dịch vụ tại chúng
            tôi!
          </p>
          <p>Vui lòng đến địa chỉ sau để thanh toán:</p>
          <p>
            <strong>Địa chỉ:</strong> 99 Nguyễn Hữu Thọ, P.Tân Hưng, Quận 7,
            TP.HCM
          </p>
          <p>
            <strong>Phòng:</strong> 101
          </p>
          <p>
            <strong>Số điện thoại liên hệ:</strong> 039 487 9999
          </p>
          <p>Xin cảm ơn!</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Payment;
