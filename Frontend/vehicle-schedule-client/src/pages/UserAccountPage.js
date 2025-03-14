import { useEffect, useState } from "react";
import NavigationBar from "../components/NavigationBar";
import "../styles/userAccount.css";

const UserAccountPage = () => {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://127.0.0.1:5000/account/details", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.msg) {
          console.error("Error:", data.msg);
        } else {
          setUser(data.user);
          setBookings(data.bookings);
        }
      })
      .catch((error) => console.error("Error fetching user details:", error));
  }, []);

  return (
    <div className="account-page">
      <NavigationBar />

      {/* Welcome Banner */}
      <div className="welcome-banner">
        <h2>🚀 Welcome to Your CarNexus Account!</h2>
        <p>Exclusive Member Perks & Discounts Await! 🎉</p>
      </div>

      <div className="account-container">
        {user ? (
          <div className="user-details">
            <h3>👤 Profile Information</h3>
            <p><strong>Name:</strong> {user.username}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {user.role_id === 1 ? "Customer" : "Service Owner"}</p>
          </div>
        ) : (
          <p className="loading">Loading user details...</p>
        )}

        <div className="booking-history">
          <h3>📅 Booking History</h3>
          {bookings.length > 0 ? (
            <ul>
              {bookings.map((booking, index) => (
                <li key={index} className="booking-entry">
                  {booking.service_type} at <strong>{booking.service_email}</strong> | Status: <span className="status">{booking.status}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p>No bookings yet. Start your first booking now! 🚗</p>
          )}
        </div>
      </div>

      {/* Member Perks Section */}
      <div className="perks-container">
        <h2>✨ Exclusive Member Perks</h2>
        <div className="perks-list">
          <div className="perk">🎟️ 10% off on all bookings</div>
          <div className="perk">💎 VIP priority support</div>
          <div className="perk">🚘 Free vehicle health check-up</div>
          <div className="perk">🛠️ Access to premium service providers</div>
        </div>
      </div>

      {/* Footer */}
      {/* <footer className="footer">
        <p>© 2025 CarNexus. All rights reserved.</p>
        <a href="#">Privacy Policy</a> | <a href="#">Terms of Service</a> | <a href="#">Contact Us</a>
      </footer> */}
    </div>
  );
};

export default UserAccountPage;
