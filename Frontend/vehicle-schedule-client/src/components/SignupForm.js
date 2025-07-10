import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/signup.css";

const SignupForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role_id: "1",
    vehicle_type: "",
    purchase_date: "",
    is_first_hand: "yes",
    service_name: "",
    location: "",
    contact_info: "",
    rating: ""
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(""); // Clear error on change
  };

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;

    const {
      username,
      email,
      password,
      role_id,
      vehicle_type,
      purchase_date,
      service_name,
      location,
      contact_info,
      rating
    } = formData;

    if (!username.trim()) {
      setError("Username is required.");
      return false;
    }

    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return false;
    }

    if (!passwordRegex.test(password)) {
      setError("Password must be at least 6 characters and include a letter and a number.");
      return false;
    }

    if (role_id === "1") {
      if (!vehicle_type.trim() || !purchase_date.trim()) {
        setError("Please fill in all customer fields.");
        return false;
      }
    }

    if (role_id === "2") {
      if (
        !service_name.trim() ||
        !location.trim() ||
        !contact_info.trim() ||
        rating === ""
      ) {
        setError("Please fill in all service owner fields.");
        return false;
      }

      const numericRating = parseFloat(rating);
      if (isNaN(numericRating) || numericRating < 0 || numericRating > 5) {
        setError("Rating must be a number between 0 and 5.");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const {
      username,
      email,
      password,
      role_id,
      vehicle_type,
      purchase_date,
      is_first_hand,
      service_name,
      location,
      contact_info,
      rating
    } = formData;

    let extra_data = {};

    if (role_id === "1") {
      extra_data = {
        vehicle_type,
        purchase_date,
        ownership_status: is_first_hand === "yes" ? "first-hand" : "second-hand"
      };
    } else if (role_id === "2") {
      extra_data = {
        business_name: service_name,
        location,
        contact: contact_info,
        rating: parseFloat(rating)
      };
    }

    const payload = {
      username,
      email,
      password,
      role_id: parseInt(role_id),
      extra_data
    };

    try {
      const response = await fetch("http://127.0.0.1:5000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Registration successful! Please login.");
        navigate("/");
      } else {
        setError(data.msg || "Registration failed.");
      }
    } catch (error) {
      setError("Server error. Please try again later.");
    }
  };

  const isCustomer = formData.role_id === "1";
  const isServiceOwner = formData.role_id === "2";

  return (
    <div className="login-container">
      <h2>Sign Up</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form className="login-form" onSubmit={handleSubmit}>
        <label>Username:</label>
        <input name="username" value={formData.username} onChange={handleChange} required />

        <label>Email:</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} required />

        <label>Password:</label>
        <input type="password" name="password" value={formData.password} onChange={handleChange} required />

        <label>Role:</label>
        <select name="role_id" value={formData.role_id} onChange={handleChange}>
          <option value="1">Customer</option>
          <option value="2">Service Owner</option>
        </select>

        {/* Customer Fields */}
        {isCustomer && (
          <>
            <label>Vehicle Type:</label>
            <input name="vehicle_type" value={formData.vehicle_type} onChange={handleChange} required />

            <label>Purchase Date:</label>
            <input type="date" name="purchase_date" value={formData.purchase_date} onChange={handleChange} required />

            <label>First-hand or Second-hand:</label>
            <select name="is_first_hand" value={formData.is_first_hand} onChange={handleChange}>
              <option value="yes">First-hand</option>
              <option value="no">Second-hand</option>
            </select>
          </>
        )}

        {/* Service Owner Fields */}
        {isServiceOwner && (
          <>
            <label>Service Name:</label>
            <input name="service_name" value={formData.service_name} onChange={handleChange} required />

            <label>Location:</label>
            <input name="location" value={formData.location} onChange={handleChange} required />

            <label>Contact Info:</label>
            <input name="contact_info" value={formData.contact_info} onChange={handleChange} required />

            <label>Rating:</label>
            <input
              type="number"
              step="0.1"
              max="5"
              min="0"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              required
            />
          </>
        )}

        <button type="submit">Register</button>
        <Link to="/" className="back-link">← Back to Login</Link>
      </form>
    </div>
  );
};

export default SignupForm;
