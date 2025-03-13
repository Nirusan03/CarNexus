import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:5000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("role_id", data.role_id);

      if (data.role_id === 1) {
        navigate("/home"); // Redirect customers to dashboard
      } else if (data.role_id === 2) {
        navigate("/business-dashboard"); // Redirect service owners
      }
    } else {
      setError(data.msg || "Login failed");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>Email:</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div className="input-group">
            <label>Password:</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>

          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
