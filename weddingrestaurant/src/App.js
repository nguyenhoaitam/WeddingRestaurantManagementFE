import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./components/Home/Home";
import Footer from "./layouts/Footer";
import Header from "./layouts/Header";
import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./components/User/Login/Login";
import Register from "./components/User/Register/Register"
import Hall from  "./components/Hall/Hall"

const App = () => {
  return (
    <BrowserRouter>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/hall" element={<Hall />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
};

export default App;
