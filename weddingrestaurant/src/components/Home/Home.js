import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import "../../App.css";
import "./Home.css"

const Home = () => {
  return (
    <>
      <ul>
        <li>
          <Link to="/login">Go to Login</Link>
        </li>
      </ul>
    </>
  );
};

export default Home;
