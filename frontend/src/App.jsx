import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import DoctorLogin from "./pages/Doctor/LoginPage/logIn";
import AdminLogin from "./pages/admin/LoginPage/logInPage";
import ProtectedRoute from "./config/ProtectedRoute";
import AdminDashboard from "./pages/admin/Dashboard/Dashboard";
import DoctorDashboard from "./pages/Doctor/Dashboard/Dashboard";
import Announcement from "./pages/admin/Announcement/Announcement";
import AdminAppointment from "./pages/admin/Appointments/QueueAndAppointments";
import Doctor from "./pages/admin/Doctor/Doctor";
import Users from "./pages/admin/Users/Users";
import AdminStatus from "./pages/admin/Status/Status";
import DoctorQueueAndAppointments from "./pages/Doctor/Appointments/WaitlistAndAppointments";
import Registration from "./pages/Doctor/Registration/Registration";
import Schedules from "./pages/Doctor/Schedules/Schedules";

function App() {
  return (
    <Router>
      <Routes>
        {/* Default redirects */}
        <Route path="/" element={<Navigate to="/doctor/login" />} />
        <Route path="/doctor" element={<Navigate to="/doctor/login" />} />
        <Route path="/admin" element={<Navigate to="/admin/login" />} />

        {/* Auth routes */}
        <Route path="/doctor/login" element={<DoctorLogin />} />
        <Route path="/doctor/register" element={<Registration />} />
        <Route path="/admin/login" element={<AdminLogin />} />


        {/* Protected Doctor routes */}
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
          <Route path="/doctor/waitlist&appointments" element={<DoctorQueueAndAppointments />} />
          <Route path="/doctor/schedules" element={<Schedules />} />
        </Route>

        {/* Protected Admin routes */}
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/announcement" element={<Announcement />} />
          <Route path="/admin/waitlist&appointments" element={<AdminAppointment />} />
          <Route path="/admin/doctors" element={<Doctor />} />
          <Route path="/admin/users" element={<Users/>} />
          <Route path="/admin/status" element={<AdminStatus />} />


        </Route>

        {/* Not authorized route */}
        <Route path="/not-authorized" element={<div>Not Authorized</div>} />
      </Routes>
    </Router>
  );
}

export default App;