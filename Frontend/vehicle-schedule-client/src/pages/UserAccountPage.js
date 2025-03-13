import { useEffect, useState } from "react";
import NavigationBar from "../components/NavigationBar";

const UserAccountPage = () => {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://127.0.0.1:5000/account", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => response.json())
      .then((data) => {
        setUser(data.user);
        setBookings(data.bookings);
      })
      .catch((error) => console.error("Error fetching user details:", error));
  }, []);

  return (
    <div>
      <NavigationBar />
      <h2>User Account</h2>

      {user ? (
        <div>
          <p><strong>Name:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role_id === 1 ? "Customer" : "Service Owner"}</p>

          <h3>Booking History</h3>
          {bookings.length > 0 ? (
            <ul>
              {bookings.map((booking, index) => (
                <li key={index}>
                  {booking.service_type} at {booking.business_id} | Status: {booking.status}
                </li>
              ))}
            </ul>
          ) : (
            <p>No bookings yet.</p>
          )}
        </div>
      ) : (
        <p>Loading user details...</p>
      )}
    </div>
  );
};

export default UserAccountPage;
