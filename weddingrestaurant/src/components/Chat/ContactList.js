// import React, { useState, useEffect, useContext } from "react";
// import { useNavigate } from "react-router-dom";
// import { MyUserContext } from "../../configs/Contexts";
// import "./ContactList.css";
// import APIs, { endpoints } from "../../configs/APIs";

// const ContactList = () => {
//   const [bookings, setBookings] = useState([]); // Đổi tên biến để phù hợp với đơn đặt tiệc
//   const [filteredBookings, setFilteredBookings] = useState([]); // Đổi tên biến để phù hợp với đơn đặt tiệc
//   const [loading, setLoading] = useState(true);
//   const [isCustomer, setIsCustomer] = useState(false); // Thay đổi tên biến để phù hợp với vai trò
//   const [searchQuery, setSearchQuery] = useState("");
// //   const user = useContext(MyUserContext);
//   const navigate = useNavigate();
//   const [user, setUser] = useState();

//     useEffect(()=> {
//         const token = localStorage.getItem("token");
//         const res = await APIs.get(endpoints.customer_booking(user.id), {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//     })


//   useEffect(() => {
//     const fetchBookings = async () => {
//       setLoading(true);
      
//       try {
//         let response;
//         if (user.user_role === "customer") {
//           // Thay đổi kiểm tra vai trò
//           response = await APIs.get(endpoints["customer_booking"](user.id)); // Thay đổi endpoint
//         } else {
//           response = await APIs.get(endpoints["staff_booking"](user.id)); // Thay đổi endpoint
//         }

//         if (response.data && Array.isArray(response.data)) {
//           setBookings(response.data);
//           setFilteredBookings(response.data);
//         } else {
//           setBookings([]);
//           setFilteredBookings([]);
//         }
//       } catch (error) {
//         console.error(error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBookings();
//   }, [user.user_role, user.id]);

//   useEffect(() => {
//     setIsCustomer(user.user_role === "customer"); // Thay đổi tên biến để phù hợp với vai trò
//   }, [user.user_role]);

//   useEffect(() => {
//     if (searchQuery === "") {
//       setFilteredBookings(bookings);
//     } else {
//       setFilteredBookings(
//         bookings.filter((item) =>
//           item.name.toLowerCase().includes(searchQuery.toLowerCase())
//         )
//       );
//     }
//   }, [searchQuery, bookings]);

//   const handleChat = (item) => {
//     navigate(`/chat/${item.id}`); // Chuyển đến phòng chat dựa trên ID của đơn đặt tiệc
//   };

//   if (loading) {
//     return <div className="spinner">Loading...</div>;
//   }

//   if (bookings.length === 0) {
//     return (
//       <div className="container">
//         <div className="TopBackGround">
//           <h2 className="greeting">CHAT</h2>
//         </div>
//         <p className="noDataText">Chưa có cuộc trò chuyện nào.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="container">
//       <div className="TopBackGround">
//         <h2 className="greeting">CHAT</h2>
//       </div>
//       <input
//         type="text"
//         className="searchInput"
//         placeholder="Tìm kiếm đơn đặt tiệc..."
//         value={searchQuery}
//         onChange={(e) => setSearchQuery(e.target.value)}
//       />
//       <div className="listContainer">
//         {filteredBookings.map((item) => (
//           <div key={item.id} className="chat">
//             <button className="contactItem" onClick={() => handleChat(item)}>
//               Đơn đặt tiệc {item.name}
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ContactList;
