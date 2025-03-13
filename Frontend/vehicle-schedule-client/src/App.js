import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import BookingPage from "./pages/BookingPage";
import UserAccountPage from "./pages/UserAccountPage";
import NavigationBar from "./components/NavigationBar";

function App() {
  return (
    <Router>
      {/* <NavigationBar /> */}
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/booking" element={<BookingPage />} />  {/* Corrected path */}
        <Route path="/account" element={<UserAccountPage />} />
      </Routes>
    </Router>
  );
}

export default App;
