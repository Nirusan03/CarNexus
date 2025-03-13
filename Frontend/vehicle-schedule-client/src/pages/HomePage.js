import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavigationBar from "../components/NavigationBar";

const HomePage = () => {
  const [businessOwners, setBusinessOwners] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://127.0.0.1:5000/business/business-owners")
      .then((response) => response.json())
      .then((data) => setBusinessOwners(data))
      .catch((error) => console.error("Error fetching business owners:", error));
  }, []);

  return (
    <div>
      <NavigationBar />
      <h2>Service Providers</h2>
      <table border="1" cellPadding="10">
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
          {businessOwners.map((owner, index) => (
            <tr key={index}>
              <td>{owner.business_name}</td>
              <td>{owner.location}</td>
              <td>{owner.contact}</td>
              <td>{owner.rating}</td>
              <td>
                <button onClick={() => navigate(`/booking?business=${owner.business_name}`)}>Book Now</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HomePage;
