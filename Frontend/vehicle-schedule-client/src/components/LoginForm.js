import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/login.css";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Basic email and password format validation
  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    // At least 6 characters, one letter and one number

    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return false;
    }

    if (!passwordRegex.test(password)) {
      setError(
        "Password must be at least 6 characters long and contain at least one letter and one number."
      );
      return false;
    }

    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("role_id", data.role_id.toString());
        localStorage.setItem("email", data.email);
        console.log("Logged in as role:", data.role_id);

        if (parseInt(data.role_id) === 1) {
          navigate("/home"); // Customer
        } else if (parseInt(data.role_id) === 2) {
          navigate("/service-dashboard"); // Service owner
        }
      } else {
        setError(data.msg || "Login failed");
      }
    } catch (err) {
      setError("Server error. Please try again later.");
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              required
            />
          </div>

          <div className="input-group">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              required
            />
          </div>

          <button type="submit">Login</button>

          <p className="signup-link">
            Don&apos;t have an account? <Link to="/signup">Sign up here</Link>
          </p>

          <button type="button" onClick={handleBack} className="back-button">
            ← Back
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
