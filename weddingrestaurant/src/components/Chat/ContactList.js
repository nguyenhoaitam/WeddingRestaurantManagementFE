import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./ContactList.css";
import APIs, { authApi, endpoints } from "../../configs/APIs";

const ContactList = () => {
  const [booking, setBooking] = useState([]);
  const [filteredBooking, setFilteredBooking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCustomer, setIsCustomer] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState("");
  const [token, setToken] = useState("");
  const navigate = useNavigate();

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");
      setToken(token);
      console.log("Token: ", token);
      const userResponse = await authApi(token).get(endpoints["current_user"]);
      console.log(userResponse.data);
      setUser(userResponse.data);
    } catch (error) {
      console.error("Lỗi tải người dùng: ", error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchBooking = async () => {
      setLoading(true);

      try {
        let response;

        if (!user) {
          setLoading(false);
          return;
        }

        if (user.user_role === "customer") {
          if (user.customer) {
            response = await APIs.get(endpoints.customer_booking(user.id), {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            console.log("Booking: " + JSON.stringify(response.data));
            if (response.data && !Array.isArray(response.data)) {
              response.data = [response.data];
            }
          } else {
            setLoading(false);
            return;
          }
        } else {
          response = await APIs.get(endpoints.staff_booking(user.id), {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        }

        if (response && response.data && Array.isArray(response.data)) {
          setBooking(response.data);
          setFilteredBooking(response.data);
        } else {
          setBooking([]);
          setFilteredBooking([]);
        }
      } catch (error) {
        console.error("Lỗi khi gọi API: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [user]);

  useEffect(() => {
    setIsCustomer(user.user_role === "customer");
  }, [user.user_role]);

  useEffect(() => {
    if (searchQuery === "") {
      setFilteredBooking(booking);
    } else {
      setFilteredBooking(
        booking.filter((item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  }, [searchQuery, booking]);

  const handleChat = (item) => {
    navigate(`/chat/${item.id}`);
  };

  if (loading) {
    return <div className="spinner">Loading...</div>;
  }

  if (booking.length === 0) {
    return (
      <div className="contact-container">
        <div className="TopBackGround">
          <h2 className="greeting">CHAT</h2>
        </div>
        <p className="noDataText">Chưa có đoạn hội thoại nào.</p>
      </div>
    );
  }

  return (
    <div className="contact-container">
      <div className="TopBackGround">
        <h2 className="greeting">NHẮN TIN</h2>
      </div>
      <div className="group-contaier">
        <input
          type="text"
          className="searchInput"
          placeholder="Tìm kiếm nhóm..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="listContainer">
          {filteredBooking.map((item) => (
            <div key={item.id} className="chat">
              <button className="contactItem" onClick={() => handleChat(item)}>
                Nhóm chat {item.name}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContactList;
