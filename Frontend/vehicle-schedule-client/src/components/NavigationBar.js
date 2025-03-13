import { Link } from "react-router-dom";
import "../styles/navbar.css";

const NavigationBar = () => {
  return (
    <nav className="navbar">
      <div className="logo">CarNexus</div>
      <ul className="nav-links">
        <li><Link to="/home">Home</Link></li>
        <li><Link to="/booking">Bookings</Link></li>
        <li><Link to="/account">User Account</Link></li>
      </ul>
    </nav>
  );
};

export default NavigationBar;
