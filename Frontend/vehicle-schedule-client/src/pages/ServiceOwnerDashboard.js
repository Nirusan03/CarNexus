import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/serviceOwnerDashboard.css";

const ServiceOwnerDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState({});
  const [reportForm, setReportForm] = useState({});
  const [ownerInfo, setOwnerInfo] = useState(null);

  const token = localStorage.getItem("token");
  const userEmail = localStorage.getItem("email");

  const statusOptions = [
    "Pending",
    "In Progress",
    "Ready for Pickup",
    "Completed",
  ];

  useEffect(() => {
    fetchBookings();
    fetchOwnerInfo();
  }, []);

  const fetchBookings = async () => {
    try {
      const ownerEmail = localStorage.getItem("email");
      const response = await axios.get(
        `http://127.0.0.1:5000/booking/owner/${ownerEmail}`
      );
      setBookings(response.data.bookings);
    } catch (error) {
      console.error("Error fetching owner bookings:", error);
    }
  };

  const fetchOwnerInfo = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:5000/service/service-owners",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const matchedOwner = response.data.find(
        (owner) => owner.email === userEmail
      );
      setOwnerInfo(matchedOwner);
    } catch (error) {
      console.error("Error fetching service owner info:", error);
    }
  };

  const handleStatusChange = (bookingId, newStatus) => {
    setSelectedStatuses((prev) => ({ ...prev, [bookingId]: newStatus }));
  };

  const updateStatus = async (bookingId) => {
    try {
      const status = selectedStatuses[bookingId];
      const fromEmail = ownerInfo?.email;

      if (!status || status.trim() === "") {
        alert("Please select a status before updating.");
        return;
      }

      await axios.patch(
        `http://localhost:5000/booking/update-status/${bookingId}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await fetchBookings();

      const updatedBooking = bookings.find((b) => b._id === bookingId);

      if (updatedBooking) {
        const subject = "Booking Status Update";
        const body = `Dear Customer,\n\nYour service booking for "${
          updatedBooking.service_type
        }" has been updated.\n\nStatus: ${status}\nPickup Time: ${
          updatedBooking.pickup_time
        }\nDrop-off Time: ${
          updatedBooking.dropoff_time
        }\n\nIf you have any questions, feel free to reply to this message.\n\nBest regards,\n${
          ownerInfo?.owner_name || "Your Service Provider"
        }\nEmail: ${fromEmail}`;

        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${
          updatedBooking.customer_email
        }&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

        window.open(gmailUrl, "_blank");
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleReportChange = (bookingId, field, value) => {
    setReportForm((prev) => ({
      ...prev,
      [bookingId]: { ...prev[bookingId], [field]: value },
    }));
  };

  const submitReport = async (bookingId) => {
    try {
      const report = reportForm[bookingId];
      if (!report) {
        alert("Please fill out the report before submitting.");
        return;
      }

      const { issues_found, work_done, total_cost } = report;

      if (!issues_found || issues_found.trim() === "") {
        alert("Please describe the issues found.");
        return;
      }

      if (!work_done || work_done.trim() === "") {
        alert("Please describe the work done.");
        return;
      }

      const cost = parseFloat(total_cost);
      if (isNaN(cost) || cost < 0) {
        alert("Please enter a valid positive total cost.");
        return;
      }

      await axios.patch(
        `http://localhost:5000/booking/add-report/${bookingId}`,
        report,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchBookings();
    } catch (error) {
      console.error("Error submitting report:", error);
    }
  };

  return (
    <div className="account-container">
      <h2>Service Owner Dashboard</h2>

      {ownerInfo && (
        <div className="owner-info-card">
          <h3>Welcome, {ownerInfo.owner_name}</h3>
          <p>
            <strong>Email:</strong> {ownerInfo.email}
          </p>
          <p>
            <strong>Service Name:</strong> {ownerInfo.business_name}
          </p>
          <p>
            <strong>Location:</strong> {ownerInfo.location}
          </p>
          <p>
            <strong>Contact:</strong> {ownerInfo.contact}
          </p>
          <p>
            <strong>Rating:</strong> {ownerInfo.rating}
          </p>
        </div>
      )}

      {bookings.length === 0 ? (
        <p>No bookings received yet.</p>
      ) : (
        <div className="booking-list">
          {bookings.map((booking) => (
            <div key={booking._id} className="booking-card">
              <p>
                <strong>Customer:</strong> {booking.customer_email}
              </p>
              <p>
                <strong>Service Type:</strong> {booking.service_type}
              </p>
              <p>
                <strong>Pickup:</strong> {booking.pickup_time}
              </p>
              <p>
                <strong>Drop-off:</strong> {booking.dropoff_time}
              </p>
              <p>
                <strong>Status:</strong> {booking.status}
              </p>
              <p>
                <strong>From:</strong> {ownerInfo?.email}
              </p>

              {/* Unified Report + Status Section */}
              <div className="report-section">
                {/* Service Report Input Form (only if not yet submitted) */}
                {!booking.service_report && (
                  <>
                    <h4>Service Report</h4>
                    <textarea
                      placeholder="Issues Found"
                      onChange={(e) =>
                        handleReportChange(
                          booking._id,
                          "issues_found",
                          e.target.value
                        )
                      }
                    />
                    <textarea
                      placeholder="Work Done"
                      onChange={(e) =>
                        handleReportChange(
                          booking._id,
                          "work_done",
                          e.target.value
                        )
                      }
                    />
                    <input
                      type="number"
                      placeholder="Total Cost"
                      onChange={(e) =>
                        handleReportChange(
                          booking._id,
                          "total_cost",
                          e.target.value
                        )
                      }
                    />
                  </>
                )}

                {/* Status Dropdown */}
                <div className="status-update">
                  <select
                    value={selectedStatuses[booking._id] || booking.status}
                    onChange={(e) =>
                      handleStatusChange(booking._id, e.target.value)
                    }
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Action Buttons */}
                <div className="action-buttons">
                  {!booking.service_report && (
                    <button
                      className="submit-btn"
                      onClick={() => submitReport(booking._id)}
                    >
                      Submit Report
                    </button>
                  )}
                  <button
                    className="status-btn"
                    onClick={() => updateStatus(booking._id)}
                  >
                    Update Status
                  </button>
                </div>
              </div>

              {/* If report exists, show summary instead */}
              {booking.service_report && (
                <div className="report-summary">
                  <h4>Report Summary</h4>
                  <p>
                    <strong>Issues:</strong>{" "}
                    {booking.service_report.issues_found}
                  </p>
                  <p>
                    <strong>Work:</strong> {booking.service_report.work_done}
                  </p>
                  <p>
                    <strong>Cost:</strong> Rs.
                    {booking.service_report.total_cost}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ServiceOwnerDashboard;
