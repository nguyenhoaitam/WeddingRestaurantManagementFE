// import React, { useState, useEffect, useContext } from 'react';
// import { ref, push, set, onValue } from 'firebase/database';
// import { database } from '../../configs/Firebase';
// import { useNavigate, useParams } from 'react-router-dom';
// import { MyUserContext } from '../../configs/Contexts';
// import './Chat.css';

// const Chat = () => {
//     const [messages, setMessages] = useState([]);
//     const [input, setInput] = useState('');
//     const { weddingBookingId } = useParams(); // Lấy ID đơn đặt tiệc từ URL
//     const navigate = useNavigate();
//     const user = useContext(MyUserContext);

//     // Đảm bảo dữ liệu người dùng tồn tại
//     const loggedInUser = {
//         _id: user?.id || 'default-id',
//         name: user?.first_name + ' ' + user?.last_name || 'Anonymous',
//         avatar: user?.avatar || 'path/to/default-avatar.png',
//     };

//     const handleBack = () => {
//         navigate('/contact_list'); // Điều hướng về danh sách liên hệ
//     };

//     useEffect(() => {
//         const messagesRef = ref(database, `weddingBookings/${weddingBookingId}/messages`); // Thay đổi đường dẫn cho đúng với cấu trúc
//         onValue(messagesRef, (snapshot) => {
//             const data = snapshot.val();
//             if (data) {
//                 const fetchedMessages = Object.keys(data).map((key) => ({
//                     id: key,
//                     ...data[key],
//                 }));
//                 setMessages(fetchedMessages);
//             }
//         });
//     }, [weddingBookingId]);

//     const onSend = async () => {
//         if (input.trim().length === 0) {
//             console.error('Input is empty');
//             return;
//         }

//         const newMessage = {
//             _id: Date.now().toString(),
//             createdAt: new Date().toISOString(),
//             text: input,
//             user: loggedInUser,
//             read: false,
//         };

//         console.log('Sending message:', newMessage);

//         try {
//             const newMessageRef = push(ref(database, `weddingBookings/${weddingBookingId}/messages`));
//             await set(newMessageRef, newMessage);
//             setInput(''); // Xóa nội dung input sau khi gửi tin nhắn
//         } catch (error) {
//             console.error('Error sending message:', error);
//         }
//     };

//     return (
//         <div className="chat-container">
//             <div className="chat-header">
//                 <button onClick={handleBack} className="back-button">
//                     &#8592;
//                 </button>
//                 <h2>CHAT ROOM {weddingBookingId}</h2> {/* Hiển thị ID đơn đặt tiệc */}
//             </div>
//             <div className="chat-body">
//                 <div className="messages">
//                     {messages.map((message) => (
//                         <div
//                             key={message.id}
//                             className={`message ${message.user._id === loggedInUser._id ? 'sent' : 'received'}`}
//                         >
//                             <div className="message-content">
//                                 {message.user._id !== loggedInUser._id && (
//                                     <div className="message-avatar">
//                                         <img src={message.user.avatar} alt={message.user.name} />
//                                     </div>
//                                 )}
//                                 <div className="message-text">
//                                     {message.user._id !== loggedInUser._id && <strong>{message.user.name}</strong>}
//                                     <p>{message.text}</p>
//                                     <small>{new Date(message.createdAt).toLocaleTimeString()}</small>
//                                 </div>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//             <div className="chat-input-container">
//                 <input
//                     type="text"
//                     value={input}
//                     onChange={(e) => setInput(e.target.value)}
//                     placeholder="Type a message..."
//                 />
//                 <button onClick={onSend} className="send-button">
//                     Send
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default Chat;
