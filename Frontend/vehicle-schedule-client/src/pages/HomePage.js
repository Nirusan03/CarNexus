import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavigationBar from "../components/NavigationBar";
import "../styles/homepage.css";

const HomePage = () => {
  const [serviceOwners, setServiceOwners] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://127.0.0.1:5000/service/service-owners")
      .then((response) => response.json())
      .then((data) => setServiceOwners(data))
      .catch((error) => console.error("Error fetching service owners:", error));
  }, []);

  return (
    <div className="homepage-container">
      <NavigationBar />

      {/* Animated Ad Banner */}
      <div className="ad-banner">
        <h3>🚗 Get 20% Off on Your First Booking! Limited Time Offer! 🚗</h3>
      </div>

      {/* Featured Services Section */}
      <div className="featured-services">
        <h2>🔧 Our Premium Services</h2>
        <div className="services-grid">
          <div className="service-box">🔩 Oil Change</div>
          <div className="service-box">🔧 Engine Repair</div>
          <div className="service-box">🚘 Car Wash</div>
          <div className="service-box">🛠 Brake Fix</div>
          <div className="service-box">🔋 Battery Replacement</div>
          <div className="service-box">🚗 AC Repair</div>
        </div>
      </div>

      <h2 className="title">🚙 Service Providers</h2>
      <div className="table-container">
        <table className="service-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Location</th>
              <th>Contact</th>
              <th>Rating</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {serviceOwners.map((owner, index) => (
              <tr key={index}>
                <td>{owner.owner_name}</td>
                <td>{owner.location}</td>
                <td>{owner.contact}</td>
                <td>{owner.rating}</td>
                <td>
                  <button
                    className="book-button"
                    onClick={() =>
                      navigate(`/booking?service=${owner.owner_name}`)
                    }
                  >
                    Book Now
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Customer Testimonials */}
      <div className="testimonials">
        <h2>💬 What Our Customers Say</h2>
        <div className="testimonial-box">
          <p>
            ⭐⭐⭐⭐⭐ "CarNexus helped me find the best service for my car!" -
            John D.
          </p>
        </div>
        <div className="testimonial-box">
          <p>⭐⭐⭐⭐⭐ "Super smooth process! Highly recommend." - Sarah L.</p>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="faq-section">
        <h2>❓ Frequently Asked Questions</h2>
        <div className="faq">
          <h3>📌 How does CarNexus work?</h3>
          <p>
            You choose a service provider, book a service, and get your car
            fixed!
          </p>
        </div>
        <div className="faq">
          <h3>📌 Can I cancel my booking?</h3>
          <p>Yes, you can cancel your booking within 24 hours.</p>
        </div>
      </div>

      {/* Footer */}
      {/* <footer className="footer">
        <p>© 2025 CarNexus. All rights reserved.</p>
      </footer> */}
    </div>
  );
};

export default HomePage;
