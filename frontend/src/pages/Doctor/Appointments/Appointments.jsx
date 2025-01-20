import { useState, useEffect } from "react";
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Box,
  Chip,
  IconButton,
  Tabs,
  Tab,
} from "@mui/material";
import axios from "axios";
import config from "../../../config/config";
import AppointmentDetailsDialog from "./components/AppointmentDetailsDialog"; // Import the dialog
import { Visibility, Error } from "@mui/icons-material"; // Icons for actions
import moment from "moment"; // Import moment

function Appointments() {
  const [appointments, setAppointments] = useState({ AM: [], PM: [] }); // State for AM and PM appointments
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0); // State for tab selection (AM or PM)

  // Fetch appointments function
  const fetchAppointments = async () => {
    const doctorData = JSON.parse(localStorage.getItem("doctorData"));
    try {
      const response = await axios.get(
        `${config.API_URL}/appointments/doctor/${doctorData.id}`
      );
      // Categorize appointments into AM and PM
      setAppointments(response.data);
    } catch (err) {
      setError(err.response?.data?.error || "Error fetching appointments");
    } finally {
      setLoading(false);
    }
  };

  // Fetch appointments when the component mounts
  useEffect(() => {
    // Retrieve the selected tab from localStorage, default to 0 (AM) if not set
    const savedTab = localStorage.getItem("selectedTab");
    if (savedTab !== null) {
      setSelectedTab(Number(savedTab));
    }
    fetchAppointments();
  }, []);

  // Save the selected tab to localStorage when tab changes
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
    localStorage.setItem("selectedTab", newValue); // Save the tab in localStorage
  };

  // Format appointment date using moment
  const formatDate = (dateString) => {
    return moment(dateString).format("dddd, MMMM Do YYYY"); // Format date using moment to include time
  };

  // Handle the "view details" button click
  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setOpenDialog(true);
  };

  // Handle the closing of the dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedAppointment(null);
  };

  // Filter out appointments with "Done" or "Approved" status
  const filteredAppointments = appointments[
    selectedTab === 0 ? "AM" : "PM"
  ].filter(
    (appointment) =>
      appointment.status !== "Done" &&
      appointment.status !== "Approved" &&
      appointment.slot.toUpperCase() === (selectedTab === 0 ? "AM" : "PM")
  );

  return (
    <Paper sx={{ padding: 4 }}>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", marginTop: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            marginTop: 4,
          }}
        >
          <Error color="error" fontSize="large" />
          <Typography color="error" variant="h6" sx={{ marginTop: 2 }}>
            {error}
          </Typography>
        </Box>
      ) : (
        <>
          {/* Tabs for AM and PM */}
          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            centered
            aria-label="appointment time slots"
          >
            <Tab label="AM" />
            <Tab label="PM" />
          </Tabs>

          <TableContainer
            component={Paper}
            sx={{
              maxHeight: "500px",
              overflowY: "auto",
              marginTop: 2,
            }}
          >
            <Table>
              <TableHead>
                <TableRow
                  sx={{
                    backgroundColor: "#f5f5f5",
                    borderBottom: "2px solid #ddd",
                  }}
                >
                  {[
                    "Name",
                    "Email",
                    "Purpose",
                    "Appointment Time",
                    "Slot", // New column for slot
                    "Status",
                    "Action",
                  ].map((header) => (
                    <TableCell key={header} sx={{ fontWeight: "bold" }}>
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredAppointments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Typography variant="h6" color="textSecondary">
                        No appointments found for this time slot.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAppointments.map((appointment) => (
                    <TableRow
                      key={appointment.appointment_id}
                      sx={{
                        "&:nth-of-type(even)": { backgroundColor: "#f9f9f9" },
                        "&:hover": { backgroundColor: "#f1f1f1" },
                      }}
                    >
                      <TableCell>{appointment.user_name}</TableCell>
                      <TableCell>{appointment.user_email}</TableCell>
                      <TableCell>
                        {appointment.purpose_of_appointment}
                      </TableCell>
                      <TableCell>
                        {formatDate(appointment.appointment_date)}
                      </TableCell>
                      <TableCell>{appointment.slot}</TableCell>
                      <TableCell>
                        <Chip
                          label={appointment.status}
                          color={
                            appointment.status === "Approved"
                              ? "success"
                              : "warning"
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton
                          color="primary"
                          onClick={() => handleViewDetails(appointment)}
                          sx={{ marginRight: 1 }}
                        >
                          <Visibility />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      {/* Appointment details dialog */}
      <AppointmentDetailsDialog
        open={openDialog}
        onClose={handleCloseDialog}
        appointment={selectedAppointment}
        fetchAppointments={fetchAppointments} // Pass fetchAppointments function
      />
    </Paper>
  );
}

export default Appointments;
