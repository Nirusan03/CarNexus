import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import NavigationBar from "../components/NavigationBar";

const BookingPage = () => {
  const [serviceType, setServiceType] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [dropoffTime, setDropoffTime] = useState("");
  const [business, setBusiness] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setBusiness(params.get("business") || "");
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const response = await fetch("http://127.0.0.1:5000/booking/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        business_id: business,
        service_type: serviceType,
        pickup_time: pickupTime,
        dropoff_time: dropoffTime,
      }),
    });

    if (response.ok) {
      alert("Booking Successful!");
      navigate("/home");
    } else {
      alert("Booking Failed");
    }
  };

  return (
    <div>
      <NavigationBar />
      <h2>Book a Vehicle Service</h2>
      <form onSubmit={handleSubmit}>
        <label>Service Provider:</label>
        <input type="text" value={business} disabled />

        <label>Service Type:</label>
        <input type="text" value={serviceType} onChange={(e) => setServiceType(e.target.value)} required />

        <label>Pickup Time:</label>
        <input type="datetime-local" value={pickupTime} onChange={(e) => setPickupTime(e.target.value)} required />

        <label>Drop-off Time:</label>
        <input type="datetime-local" value={dropoffTime} onChange={(e) => setDropoffTime(e.target.value)} required />

        <button type="submit">Book Now</button>
      </form>
    </div>
  );
};

export default BookingPage;
