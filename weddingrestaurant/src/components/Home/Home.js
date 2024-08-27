import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import "../../App.css";
import Login from "../../components/User/Login/Login";

const Home = () => {
  return (
    <BrowserRouter>
      <ul>
        <li><Link to="/login">Go to Login</Link></li>
      </ul>

      <Routes>
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Home;
