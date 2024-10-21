import React, { useState, useEffect, useContext } from "react";
import { ref, push, set, onValue } from "firebase/database";
import { database } from "../../configs/Firebase";
import { useNavigate, useParams } from "react-router-dom";
import "./Chat.css";
import { authApi, endpoints } from "../../configs/APIs";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState("");

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");
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

  const loggedInUser = {
    _id: user?.id || "default-id",
    name: user?.first_name + " " + user?.last_name || "Anonymous",
    avatar: user?.avatar || "path/to/default-avatar.png",
  };

  const handleBack = () => {
    navigate("/contact_list");
  };

  useEffect(() => {
    const messagesRef = ref(database, `booking/${bookingId}/messages`);
    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const fetchedMessages = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setMessages(fetchedMessages);
      }
    });

    return () => unsubscribe();
  }, [bookingId]);

  const onSend = async () => {
    if (input.trim().length === 0) {
      console.error("Chưa nhập tin nhắn");
      return;
    }

    const newMessage = {
      _id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      text: input,
      user: loggedInUser,
      read: false,
    };

    console.log("Tin nhắn gửi", newMessage);

    try {
      const newMessageRef = push(
        ref(database, `booking/${bookingId}/messages`)
      );
      await set(newMessageRef, newMessage);
      setInput("");
    } catch (error) {
      console.error("Lỗi khi gửi tin nhắn:", error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      onSend();
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <button onClick={handleBack} className="back-button">
          &#8592;
        </button>
        <h4>Tin nhắn tiệc {bookingId}</h4>
      </div>
      <div className="chat-body">
        <div className="messages">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`message ${
                message.user._id === loggedInUser._id ? "sent" : "received"
              }`}
            >
              <div className="message-content">
                {message.user._id !== loggedInUser._id && (
                  <div className="message-avatar">
                    <img src={message.user.avatar} alt={message.user.name} />
                  </div>
                )}
                <div className="message-text">
                  {message.user._id !== loggedInUser._id && (
                    <strong>{message.user.name}</strong>
                  )}
                  <p>{message.text}</p>
                  <small>
                    {new Date(message.createdAt).toLocaleTimeString()}
                  </small>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="chat-input-container">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Nhập nội dung tin nhắn..."
        />
        <button onClick={onSend} className="send-button">
          Gửi
        </button>
      </div>
    </div>
  );
};

export default Chat;
