import React, { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MyUserContext } from "../../configs/Contexts";
import APIs, { endpoints } from "../../configs/APIs";
import "./Payment.css";
import { Button, Spinner } from "react-bootstrap";
import defaultPaymentImg from "../../assets/images/transaction.png";

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useContext(MyUserContext);

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(1);
  const [loading, setLoading] = useState(false);

  // Lấy formData và totalPrice từ location.state
  const { formData, totalPrice } = location.state || {};

  if (!formData || !totalPrice) {
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

  const handleLivePayment = () => {
    alert("Đặt tiệc thành công");
    navigate("/");
  };

  const handleMoMoPayment = async () => {
    try {
      const response = await APIs.post(endpoints["momo"], null, {
        headers: { amount: totalPrice.toString() },
      });
      if (response.data.payUrl) {
        window.open(response.data.payUrl, "_blank");
        handleSubmit(true);
        // navigate("/");
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
      console.log(response.data);
      if (response.data.order_url) {
        window.open(response.data.order_url, "_blank");
        navigate("/");
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
          handleLivePayment();
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
  
      // Kiểm tra xem người dùng đã đăng nhập hay chưa
      if (!user || !user.id) {
        alert("Bạn cần đăng nhập để đặt tiệc.");
        navigate("/login");  // Chuyển hướng người dùng đến trang đăng nhập
        return;
      }
  
      // Tạo formData chứa thông tin đặt tiệc
      const formDataToSubmit = new FormData();
  
      // Thêm các trường dữ liệu đơn đặt tiệc
      formDataToSubmit.append("name", formData.name);  // Tên đặt tiệc
      formDataToSubmit.append("description", formData.description);  // Mô tả
      formDataToSubmit.append("table_quantity", formData.table_quantity);  // Số lượng bàn
      formDataToSubmit.append("rental_date", formData.rental_date);  // Ngày thuê
      formDataToSubmit.append("time_of_day", formData.time_of_day);  // Buổi trong ngày
      formDataToSubmit.append("payment_method", selectedPaymentMethodObj.name);  // Phương thức thanh toán
      formDataToSubmit.append("payment_status", paymentStatus ? "Đã thanh toán" : "Chờ thanh toán");  // Trạng thái thanh toán
      formDataToSubmit.append("total_price", totalPrice);  // Tổng tiền
      formDataToSubmit.append("customer", user.id);  // ID của khách hàng (người dùng đang đăng nhập)
      formDataToSubmit.append("wedding_hall", formData.wedding_hall);  // Hội trường cưới
      formDataToSubmit.append("event_type", formData.event_type);  // Loại sự kiện

      console.log("aaa: " + formDataToSubmit)
  
      // Thêm danh sách các món ăn, đồ uống và dịch vụ
      formData.foods.forEach((food, index) => {
        formDataToSubmit.append(`foods[${index}]`, food);
      });
  
      formData.drinks.forEach((drink, index) => {
        formDataToSubmit.append(`drinks[${index}]`, drink);
      });
  
      formData.services.forEach((service, index) => {
        formDataToSubmit.append(`services[${index}]`, service);
      });

      console.log("aaa2: " + formDataToSubmit)
  
      // Gửi dữ liệu đến API đặt tiệc
      const res = await APIs.post(endpoints["booking"], formDataToSubmit, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      
  
      // Kiểm tra phản hồi của API
      // if (res.status === 201) {
      //   alert("Đặt tiệc thành công");
      //   navigate("/");  // Chuyển hướng người dùng sau khi đặt tiệc thành công
      // } else {
      //   alert("Đăng ký đặt tiệc thất bại. Vui lòng thử lại!");
      // }
    } catch (error) {
      console.error("Lỗi khi lưu thông tin đặt tiệc:", error);
      alert("Có lỗi xảy ra khi đăng ký đặt tiệc. Vui lòng thử lại sau!");
    } finally {
      setLoading(false);
    }
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
    </div>
  );
};

export default Payment;
