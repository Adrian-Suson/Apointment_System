import { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  Alert,
  Grid,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import axios from "axios";
import config from "../../config/config";

// Utility function to format date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  return date.toLocaleDateString("en-US", options);
};

const Appointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState("");

  // Fetch appointments by user ID (use actual user ID from context or props)
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const userId = localStorage.getItem("userId"); // Replace with actual user ID
        const response = await axios.get(
          `${config.API_URL}/appointments/user/${userId}`
        );
        // Reverse the appointments array to show the newest ones last
        const reversedAppointments = response.data.reverse();
        setAppointments(reversedAppointments);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        setError("Error fetching appointments");
      }
    };

    fetchAppointments();
  }, []);

  return (
    <Container maxWidth="md" sx={{ padding: 3 }}>
      <Box
        sx={{
          padding: 4,
          boxShadow: 4,
          backgroundColor: "#fff",
          borderRadius: 4,
          marginTop: 4,
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Your Appointments
        </Typography>

        {/* Error Message */}
        {error && <Alert severity="error">{error}</Alert>}

        {/* Mobile-Friendly Layout */}
        {appointments.length > 0 ? (
          <Grid container spacing={3}>
            {appointments.map((appointment) => (
              <Grid item xs={12} sm={6} md={4} key={appointment.appointment_id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Appointment ID: {appointment.appointment_id}
                    </Typography>
                    <Divider />
                    <Typography variant="body1" color="textSecondary">
                      <strong>Doctor:</strong> {appointment.doctor_name}
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                      <strong>Purpose:</strong>{" "}
                      {appointment.purpose_of_appointment}
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                      <strong>Status:</strong> {appointment.status}
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                      <strong>Appointment Date:</strong>{" "}
                      {formatDate(appointment.schedule_date)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography variant="h6" align="center" sx={{ marginTop: 3 }}>
            No appointments available.
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default Appointment;
