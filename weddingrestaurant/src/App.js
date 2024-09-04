import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { ContextProvider } from "./configs/Contexts";
import Home from "./components/Home/Home";
import Footer from "./layouts/Footer";
import Header from "./layouts/Header";
import Login from "./components/User/Login/Login";
import Register from "./components/User/Register/Register";
import Profile from "./components/User/Profile/Profile"
import Hall from "./components/Hall/Hall";
import Menu from "./components/Menu/Menu"


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
          <Route path="/menu" element={<Menu />} />
        </Routes>

        <Footer />
      </BrowserRouter>
    </ContextProvider>
  );
};

export default App;
