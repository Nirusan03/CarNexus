import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import NavigationBar from "../components/NavigationBar";
import "../styles/booking.css"; 

const BookingPage = () => {
  const [serviceOwners, setServiceOwners] = useState([]);
  const [selectedService, setSelectedService] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [dropoffTime, setDropoffTime] = useState("");
  const [isFromHome, setIsFromHome] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetch("http://127.0.0.1:5000/service/service-owners")
      .then((response) => response.json())
      .then((data) => setServiceOwners(data))
      .catch((error) => console.error("Error fetching service owners:", error));
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const serviceName = params.get("service");

    if (serviceName) {
      const selectedOwner = serviceOwners.find(owner => owner.owner_name === serviceName);
      if (selectedOwner) {
        setSelectedService(selectedOwner.owner_name);
        setIsFromHome(true);
      }
    }
  }, [location, serviceOwners]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Unauthorized. Please log in again.");
      return;
    }

    const payload = {
        service_email: selectedService,
        service_type: serviceType,
        pickup_time: pickupTime,
        dropoff_time: dropoffTime,
    };

    try {
        const response = await fetch("http://127.0.0.1:5000/booking/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (!response.ok) {
            alert(`Booking Failed: ${data.msg || "Unknown error"}`);
        } else {
            alert("🎉 Booking Successful!");
            navigate("/home");
        }
    } catch (error) {
        alert("Failed to connect to the server. Check backend.");
    }
  };

  return (
    <div className="booking-page">
      <NavigationBar />
      {/* Animated Promotional Banner */}
      <div className="promo-banner">
        <p>🔥 Limited Offer: Get 30% Off on Your First Service! 🔥</p>
      </div>

      {/* 📢 Advertisement Section */}
      <div className="ads-container">
        <div className="ad">💡 Need a Quick Fix? Find the Best Service Providers Now!</div>
        <div className="ad">🎉 Special Discount: 10% Off on All Premium Services!</div>
        <div className="ad">🛠️ Get Your Car Serviced with Experts at CarNexus!</div>
      </div>

      {/* Booking Form */}
      <div className="booking-card">
        <h2>📅 Book a Vehicle Service</h2>
        <form onSubmit={handleSubmit}>
          
          <div className="form-group">
            <label>Service Provider:</label>
            {isFromHome ? (
              <input type="text" value={selectedService} disabled className="input-field disabled"/>
            ) : (
              <select value={selectedService} onChange={(e) => setSelectedService(e.target.value)} required className="input-field">
                <option value="">-- Select a Provider --</option>
                {serviceOwners.map((owner, index) => (
                  <option key={index} value={owner.email}>
                    {owner.owner_name} - {owner.service_name} ({owner.location})
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="form-group">
            <label>Service Type:</label>
            <input type="text" value={serviceType} onChange={(e) => setServiceType(e.target.value)} required className="input-field"/>
          </div>

          <div className="form-group">
            <label>Pickup Time:</label>
            <input type="datetime-local" value={pickupTime} onChange={(e) => setPickupTime(e.target.value)} required className="input-field"/>
          </div>

          <div className="form-group">
            <label>Drop-off Time:</label>
            <input type="datetime-local" value={dropoffTime} onChange={(e) => setDropoffTime(e.target.value)} required className="input-field"/>
          </div>

          <button type="submit" className="book-btn">🚗 Book Now</button>
        </form>
      </div>

      {/* Footer */}
      {/* <footer className="footer">
        <p>© 2025 CarNexus. All rights reserved.</p>
        <p><a href="#">Privacy Policy</a> | <a href="#">Terms of Service</a> | <a href="#">Contact Us</a></p>
      </footer> */}
    </div>
  );
};

export default BookingPage;
