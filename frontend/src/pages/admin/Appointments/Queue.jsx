import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Grid,
} from "@mui/material";
import { Visibility } from "@mui/icons-material";
import moment from "moment"; // Import moment
import config from "../../../config/config";

function Queue() {
  const [queueData, setQueueData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedQueueItem, setSelectedQueueItem] = useState(null);
  const [patientDetails, setPatientDetails] = useState(null);

  // Fetch queue data
  const fetchQueue = async () => {
    try {
      const response = await fetch(`${config.API_URL}/queue`);
      if (response.ok) {
        const data = await response.json();
        // Sort the data so that "In Process" items come at the top and "Done" at the bottom
        const sortedData = data.sort((a, b) => {
          if (
            a.queue_status === "Processing" &&
            b.queue_status !== "Processing"
          ) {
            return -1; // "In Process" comes first
          }
          if (a.queue_status === "Done" && b.queue_status !== "Done") {
            return 1; // "Done" comes last
          }
          return 0; // Keep other statuses in the order they appear
        });
        setQueueData(sortedData);
        console.log("Queue data:", data);
      } else {
        throw new Error("Queue not found for this doctor");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  const fetchPatientDetails = async (appointmentId) => {
    try {
      const response = await fetch(
        `${config.API_URL}/appointments/${appointmentId}/patient-details`
      );
      const data = await response.json();
      setPatientDetails(data);
    } catch (err) {
      console.error("Error fetching patient details:", err);
    }
  };

  const handleViewDetails = async (queueItem) => {
    setSelectedQueueItem(queueItem);
    await fetchPatientDetails(queueItem.appointment_id);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedQueueItem(null);
  };

  // Use moment for formatting the date
  const formatDate = (dateString) => {
    return moment(dateString).format("dddd, MMMM Do YYYY");
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <Typography variant="h6" color="error">
          Error: {error}
        </Typography>
      </Box>
    );
  }

  if (!queueData || queueData.length === 0) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <Typography variant="h6">No queue data available</Typography>
      </Box>
    );
  }

  return (
    <Paper sx={{ padding: 3, marginTop: 2, borderRadius: 2 }}>
      <TableContainer
        component={Paper}
        sx={{
          maxHeight: "500px",
          overflowY: "auto",
        }}
      >
        <Table sx={{ minWidth: 650 }} aria-label="queue table">
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell sx={{ fontWeight: "bold" }}>User Name</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Doctor Name</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>
                Purpose of Appointment
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {queueData.map((queueItem) => (
              <TableRow
                key={queueItem.appointment_id}
                sx={{
                  "&:hover": {
                    backgroundColor: "#f5f5f5",
                  },
                }}
              >
                <TableCell>{queueItem.user_name}</TableCell>
                <TableCell>{queueItem.doctor_name}</TableCell>
                <TableCell>{queueItem.queue_status}</TableCell>
                <TableCell>{queueItem.purpose_of_appointment}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleViewDetails(queueItem)}
                    sx={{ marginRight: 1 }}
                  >
                    <Visibility />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Queue Item Details</DialogTitle>
        <DialogContent>
          {selectedQueueItem && (
            <Box>
              <Typography variant="h6" sx={{ marginBottom: 1 }}>
                <strong>Appointment Details</strong>
              </Typography>
              <Typography variant="body1">
                <strong>Appointment ID:</strong>{" "}
                {selectedQueueItem.appointment_id}
              </Typography>
              <Typography variant="body1">
                <strong>Status:</strong> {selectedQueueItem.queue_status}
              </Typography>
              <Typography variant="body1">
                <strong>Appointment Time:</strong>{" "}
                {formatDate(selectedQueueItem.appointment_time)}
              </Typography>
              <Typography variant="body1">
                <strong>Purpose of Appointment:</strong>{" "}
                {selectedQueueItem.purpose_of_appointment}
              </Typography>
              <Typography variant="body1">
                <strong>Description:</strong>{" "}
                {selectedQueueItem.session_of_appointment}
              </Typography>

              <Box mt={2}>
                <Typography variant="h6" sx={{ marginBottom: 1 }}>
                  <strong>User Details</strong>
                </Typography>
                <Typography variant="body1">
                  <strong>User Name:</strong> {selectedQueueItem.user_name}
                </Typography>
                <Typography variant="body1">
                  <strong>User Email:</strong> {selectedQueueItem.user_email}
                </Typography>
              </Box>

              <Box mt={2}>
                <Typography variant="h6" sx={{ marginBottom: 1 }}>
                  <strong>Doctor Details</strong>
                </Typography>
                <Typography variant="body1">
                  <strong>Doctor Name:</strong> {selectedQueueItem.doctor_name}
                </Typography>
                <Typography variant="body1">
                  <strong>Doctor Email:</strong>{" "}
                  {selectedQueueItem.doctor_email}
                </Typography>
              </Box>
              {/* Medical Information */}
              <Box mt={3}>
                <Typography variant="h6" gutterBottom>
                  <strong>Medical Information</strong>
                </Typography>

                <Grid container spacing={3}>
                  {/* Vital Signs */}
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" gutterBottom>
                      <strong>Vital Signs</strong>
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="body1">
                          Height: {patientDetails?.height || "N/A"} cm
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body1">
                          Weight: {patientDetails?.weight || "N/A"} kg
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body1">
                          Blood Pressure: {patientDetails?.bp || "N/A"}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body1">
                          Blood Type: {patientDetails?.blood_type || "N/A"}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>

                  {/* Prescription */}
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" gutterBottom>
                      <strong>Prescription</strong>
                    </Typography>
                    <Typography variant="body1">
                      {patientDetails?.prescription ||
                        "No prescription recorded"}
                    </Typography>
                  </Grid>

                  {/* Diagnosis */}
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" gutterBottom>
                      <strong>Diagnosis</strong>
                    </Typography>
                    <Typography variant="body1">
                      {patientDetails?.diagnosis || "No diagnosis recorded"}
                    </Typography>

                  </Grid>

                  {/* Remarks */}
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" gutterBottom>
                      <strong>Remarks</strong>
                    </Typography>
                    <Typography variant="body1">
                      {patientDetails?.remarks || "No remarks recorded"}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}

export default Queue;
