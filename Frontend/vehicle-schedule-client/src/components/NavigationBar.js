import { Link } from "react-router-dom";

const NavigationBar = () => {
  return (
    <nav style={{ background: "#2e8b57", padding: "10px", marginBottom: "20px" }}>
      <Link to="/home" style={{ margin: "10px", color: "white", textDecoration: "none" }}>Home</Link>
      <Link to="/bookings" style={{ margin: "10px", color: "white", textDecoration: "none" }}>Bookings</Link>
      <Link to="/account" style={{ margin: "10px", color: "white", textDecoration: "none" }}>User Account</Link>
    </nav>
  );
};

export default NavigationBar;
