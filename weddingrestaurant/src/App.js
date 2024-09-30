import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { ContextProvider } from "./configs/Contexts";
import Home from "./components/Home/Home";
import Footer from "./layouts/Footer";
import Header from "./layouts/Header";
import Login from "./components/User/Login/Login";
import Register from "./components/User/Register/Register";
import Profile from "./components/User/Profile/Profile";
import Hall from "./components/Hall/Hall";
import Menu from "./components/Menu/Menu";
import Service from "./components/Service/Service";
import HallDetail from "./components/Hall/HallDetail";
import Booking from "./components/Booking/Booking"
import Payment from "./components/Payment/Payment"
import CustomerBooking from "./components/CustomerBooking/CustomerBooking";
import Feedback from "./components/Feedback/Feedback";
import Statistical from "./components/Statistical/Statistical"
import FeedbackReview from "./components/FeedbackReview/FeedbackReview"

const App = () => {
  return (
    <ContextProvider>
      <BrowserRouter>
        <Header />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/Profile" element={<Profile />} />
          <Route path="/hall" element={<Hall />} />
          <Route path="/wedding_hall/:hallId" element={<HallDetail />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/service" element={<Service />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/customer_booking" element={<CustomerBooking />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/statistical" element={<Statistical />} />
          <Route path="/feedback_review" element={<FeedbackReview />} />
        </Routes>

        <Footer />
      </BrowserRouter>
    </ContextProvider>
  );
};

export default App;