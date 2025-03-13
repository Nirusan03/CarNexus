import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import NavigationBar from "../components/NavigationBar";

const BookingPage = () => {
  const [serviceOwners, setServiceOwners] = useState([]);
  const [selectedService, setSelectedService] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [dropoffTime, setDropoffTime] = useState("");
  const [isFromHome, setIsFromHome] = useState(false); // Track if user came from home
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch service owners when page loads
  useEffect(() => {
    fetch("http://127.0.0.1:5000/service/service-owners")
      .then((response) => response.json())
      .then((data) => setServiceOwners(data))
      .catch((error) => console.error("Error fetching service owners:", error));
  }, []);

  // Get selected service provider from URL if navigated from HomePage
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const serviceName = params.get("service");

    if (serviceName) {
      const selectedOwner = serviceOwners.find(owner => owner.owner_name === serviceName);
      if (selectedOwner) {
        setSelectedService(selectedOwner.owner_name); // Store service owner's email
        setIsFromHome(true); // Lock the field
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
        service_email: selectedService, // Service provider's email
        service_type: serviceType,
        pickup_time: pickupTime,
        dropoff_time: dropoffTime,
    };

    console.log("Sending booking request:", payload); // Debugging log

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
            console.error("Booking failed:", data);
            alert(`Booking Failed: ${data.msg || "Unknown error"}`);
        } else {
            alert("Booking Successful!");
            navigate("/home");
        }
    } catch (error) {
        console.error("Network error:", error);
        alert("Failed to connect to the server. Check backend.");
    }
};

  return (
    <div>
      <NavigationBar />
      <h2>Book a Vehicle Service</h2>
      <form onSubmit={handleSubmit}>
        <label>Service Provider:</label>
        {isFromHome ? (
          <input type="text" value={selectedService} disabled />
        ) : (
          <select value={selectedService} onChange={(e) => setSelectedService(e.target.value)} required>
            <option value="">-- Select a Provider --</option>
            {serviceOwners.map((owner, index) => (
              <option key={index} value={owner.email}>
                {owner.owner_name} - {owner.service_name} ({owner.location})
              </option>
            ))}
          </select>
        )}

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
