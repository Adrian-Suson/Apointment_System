import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Layout from "./components/Layout";
import Announcement from "./pages/Announcement/Announcement";
import Login from "./pages/Login/Login"; // Login page
import Registration from "./pages/Registration/Registration"; // Registration page
import NotFound from "./pages/NotFound/NotFound"; // Optionally, a Not Found page
import ProtectedRoute from "./config/ProtectedRoute";
import Doctor from "./pages/Doctor/Doctor";
import Appointment from "./pages/Appointment/Appointment";

function App() {
  return (
    <Router>
      <Routes>
        {/* Default Redirect to Login */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Client Routes */}
        {/* Protected Doctor routes */}
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/announcement" element={<Announcement />} />
          <Route path="/appointments" element={<Appointment />} />
          <Route path="/doctors" element={<Doctor />} />
        </Route>

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/registration" element={<Registration />} />

        {/* Catch-all route for 404 (Not Found) */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
