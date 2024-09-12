import React, { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MyUserContext } from "../../configs/Contexts";
import APIs, { endpoints } from "../../configs/APIs";
import "./Payment.css";
import { Alert, Button } from "react-bootstrap";

const Payment = () => {
  const location = useLocation(); // Sử dụng useLocation để lấy dữ liệu state từ navigate
  const navigate = useNavigate();
  const user = useContext(MyUserContext);

  const [loading, setLoading] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(1);
  const [isOptionsVisible, setIsOptionsVisible] = useState(false);

  // Lấy formData và totalPrice từ location.state
  const { formData, totalPrice } = location.state || {};

  if (!formData || !totalPrice) {
    alert("Dữ liệu thanh toán không hợp lệ. Quay lại trang trước.");
    navigate(-1);
    return null;
  }

  const paymentMethods = [
    { id: 1, name: "Thanh toán trực tiếp" },
    { id: 2, name: "QR chuyển khoản", qrImage: "https://res.cloudinary.com/dkmurrwq5/image/upload/v1726154089/QR_gqbo4c.png" },
    { id: 3, name: "Ví Momo", qrImage: "https://res.cloudinary.com/dkmurrwq5/image/upload/v1726154088/Momo_bdtq5a.png" },
    { id: 4, name: "Ví ZaloPay", qrImage: "https://res.cloudinary.com/dkmurrwq5/image/upload/v1726154088/ZaloPay_b0fbui.png" },
  ];

  const handlePaymentMethodChange = (id) => {
    setSelectedPaymentMethod(id);
    setIsOptionsVisible(false);
  };

  const renderPaymentMethod = (item) => (
    <div
      className={`payment-option ${
        selectedPaymentMethod === item.id ? "selected-payment-option" : ""
      }`}
      onClick={() => handlePaymentMethodChange(item.id)}
    >
      <p>{item.name}</p>
    </div>
  );

  const handlePaymentLive = () => {
    alert("Thành công");
    navigate("/");
  };

  const handlePaymentMoMo = async () => {
    try {
      const response = await APIs.post(endpoints["momo"], null, {
        headers: {
          amount: totalPrice.toString(),
        },
      });
      if (response.data.payUrl) {
        window.open(response.data.payUrl);
        navigate("/");
      } else {
        alert("Có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại sau!");
      }
    } catch (error) {
      console.error(error);
      alert("Có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại sau!");
    }
  };

  const handlePaymentZaloPay = async () => {
    try {
      const response = await APIs.post(endpoints["zalo_pay"], null, {
        headers: {
          amount: totalPrice.toString(),
        },
      });
      if (response.data.order_url) {
        window.open(response.data.order_url);
        navigate("/");
      } else {
        alert("Có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại sau!");
      }
    } catch (error) {
      console.error(error);
      alert("Có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại sau!");
    }
  };

  return (
    <div className="payment-container">
      <h1>Thanh toán</h1>

      <div className="header-container">
        <h2>Phương thức thanh toán</h2>
        <button onClick={() => setIsOptionsVisible(!isOptionsVisible)}>
          Thay đổi
        </button>
      </div>

      {isOptionsVisible ? (
        <div>{paymentMethods.map(renderPaymentMethod)}</div>
      ) : (
        <div className="selected-method-container">
          <p>
            {
              paymentMethods.find(
                (method) => method.id === selectedPaymentMethod
              )?.name
            }
          </p>
        </div>
      )}

      {selectedPaymentMethod === 2 && !isOptionsVisible && (
        <div className="qr-container">
          <img
            src={
              paymentMethods.find(
                (method) => method.id === selectedPaymentMethod
              )?.qrImage
            }
            alt="QR code"
            className="qr-image"
          />
          <Button>Thanh toán QR chuyển khoản</Button>
        </div>
      )}

      {selectedPaymentMethod === 3 && !isOptionsVisible && (
        <div className="qr-container">
          <img
            src={
              paymentMethods.find(
                (method) => method.id === selectedPaymentMethod
              )?.qrImage
            }
            alt="QR code"
            className="qr-image"
          />
          <Button onClick={handlePaymentMoMo}>Thanh toán MoMo</Button>
        </div>
      )}

      {selectedPaymentMethod === 4 && !isOptionsVisible && (
        <div className="qr-container">
          <img
            src={
              paymentMethods.find(
                (method) => method.id === selectedPaymentMethod
              )?.qrImage
            }
            alt="QR code"
            className="qr-image"
          />
          <Button onClick={handlePaymentZaloPay}>Thanh toán ZaloPay</Button>
        </div>
      )}

      {selectedPaymentMethod === 1 && !isOptionsVisible && (
        <div className="confirmation-container">
          <Button primary onClick={handlePaymentLive}>
            Xác nhận
          </Button>
        </div>
      )}
    </div>
  );
};

export default Payment;
