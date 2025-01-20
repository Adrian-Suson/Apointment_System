import { useState, useEffect } from "react";
import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  CircularProgress,
  Alert,
  Typography,
  Avatar,
} from "@mui/material";
import { BsPersonCircle } from "react-icons/bs";
import axios from "axios";
import config from "../../config/config"; // Adjust the path to your config file
import DoctorDialog from "./components/DoctorDialog"; // Import the DoctorDialog component
import AppointmentDialog from "./components/AppointmentDialog"; // Import the new AppointmentDialog component

const Doctor = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [openAppointmentDialog, setOpenAppointmentDialog] = useState(false);

  const handleCloseDialog = () => {
    setSelectedDoctor(null);
  };

  const handleRequestAppointment = () => {
    setOpenAppointmentDialog(true); // Open the appointment dialog
  };

  const handleCloseAppointmentDialog = () => {
    setOpenAppointmentDialog(false); // Close the appointment dialog
  };

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get(`${config.API_URL}/doctors`);
        setDoctors(response.data);
        setError(""); // Clear any previous errors
      } catch (err) {
        console.error("Error fetching doctors:", err);
        setError("Failed to fetch doctors. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const handleDoctorClick = (doctor) => {
    setSelectedDoctor(doctor); // Set the selected doctor
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Doctors
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : doctors.length === 0 ? (
        <Typography variant="body1" gutterBottom>
          No doctors found.
        </Typography>
      ) : (
        <List>
          {doctors.map((doctor) => (
            <ListItem
              key={doctor.id}
              divider
              onClick={() => handleDoctorClick(doctor)}
            >
              <ListItemAvatar>
                {doctor.avatar ? (
                  <Avatar src={`${config.API_URL}/profile_pictures/${doctor.avatar}`} alt={`${doctor.name}'s avatar`} />
                ) : (
                  <Avatar>
                    <BsPersonCircle />
                  </Avatar>
                )}
              </ListItemAvatar>
              <ListItemText
                primary={doctor.name}
                secondary={
                  <span>
                    {doctor.specialization} |{" "}
                    <span
                      style={{
                        color: doctor.status === "inactive" ? "red" : "green",
                      }}
                    >
                      {doctor.status === "inactive" ? "Inactive" : "Active"}
                    </span>
                  </span>
                }
              />
            </ListItem>
          ))}
        </List>
      )}

      {/* Use the DoctorDialog component */}
      {selectedDoctor && (
        <DoctorDialog
          selectedDoctor={selectedDoctor}
          handleCloseDialog={handleCloseDialog}
          handleRequestAppointment={handleRequestAppointment}
        />
      )}

      {/* Appointment Dialog */}
      {openAppointmentDialog && (
        <AppointmentDialog
          selectedDoctor={selectedDoctor}
          handleClose={handleCloseAppointmentDialog}
        />
      )}
    </div>
  );
};

export default Doctor;
