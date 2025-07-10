import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import HomePage from "./pages/HomePage";
import BookingPage from "./pages/BookingPage";
import UserAccount from "./pages/UserAccountPage";
import ServiceOwnerDashboard from "./pages/ServiceOwnerDashboard"; // previously BusinessDashboard
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        {/* Private routes for Customers (role_id = 1) */}
        <Route element={<PrivateRoute allowedRoles={[1]} />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/account" element={<UserAccount />} />
        </Route>

        {/* Private routes for Service Owners (role_id = 2) */}
        <Route element={<PrivateRoute allowedRoles={[2]} />}>
          <Route
            path="/service-dashboard"
            element={<ServiceOwnerDashboard />}
          />
        </Route>

        {/* Optional: Catch-all for unmatched routes */}
        <Route path="*" element={<UnauthorizedPage />} />
      </Routes>
    </Router>
  );
}

export default App;
