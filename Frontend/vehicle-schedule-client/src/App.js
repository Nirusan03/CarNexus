import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<h1>Dashboard (Coming Soon)</h1>} />
      </Routes>
    </Router>
  );
}

export default App;