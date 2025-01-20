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
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Grid,
} from "@mui/material";
import moment from "moment";
import {
  CloseRounded,
  EditNotifications,
  Visibility,
} from "@mui/icons-material";
import config from "../../../config/config";
import axios from "axios";

function Waitlist() {
  const doctorData = JSON.parse(localStorage.getItem("doctorData"));
  const [waitlistData, setWaitlistData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [patientDetails, setPatientDetails] = useState(null);
  const [error, setError] = useState(null);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [openRemarksDialog, setOpenRemarksDialog] = useState(false);
  const [selectedWaitlistItem, setSelectedWaitlistItem] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [vitalSigns, setVitalSigns] = useState({
    height: "",
    weight: "",
    bp: "",
    blood_type: "",
    prescription: "",
  });
  const [diagnosis, setDiagnosis] = useState({
    diagnosisText: "",
    doctor_id: doctorData.id,
  });

  const fetchWaitlist = async () => {
    const doctorData = JSON.parse(localStorage.getItem("doctorData"));
    try {
      const response = await fetch(
        `${config.API_URL}/queue/doctor/${doctorData.id}`
      );
      if (response.ok) {
        const data = await response.json();
        console.log("Waitlist data:", data);
        const sortedData = data.sort((a, b) => {
          if (
            a.queue_status === "Processing" &&
            b.queue_status !== "Processing"
          ) {
            return -1;
          }
          if (a.queue_status === "Done" && b.queue_status !== "Done") {
            return 1;
          }
          return 0;
        });
        setWaitlistData(sortedData);
      } else {
        throw new Error("Waitlist not found for this doctor");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWaitlist();
  }, []);

  const handleCloseDetailsDialog = () => {
    setOpenDetailsDialog(false);
    setSelectedWaitlistItem(null);
  };

  const handleOpenRemarksDialog = () => {
    setRemarks(selectedWaitlistItem?.remarks || ""); // Load existing remarks
    setOpenRemarksDialog(true);
  };

  const handleCloseRemarksDialog = () => {
    setOpenRemarksDialog(false);
  };

  // Add fetch function
  const fetchPatientDetails = async (appointmentId) => {
    try {
      const response = await axios.get(
        `${config.API_URL}/appointments/${appointmentId}/patient-details`
      );
      setPatientDetails(response.data);
    } catch (err) {
      console.error("Error fetching patient details:", err);
    }
  };

  // Update handleViewDetails
  const handleViewDetails = async (waitlistItem) => {
    if (!waitlistItem) return; // Guard clause
    setSelectedWaitlistItem(waitlistItem);
    await fetchPatientDetails(waitlistItem.appointment_id);
    setOpenDetailsDialog(true);
  };

  const handleRemarksSubmit = async () => {
    console.log("Submitting remarks...", diagnosis);
    if (selectedWaitlistItem) {
      try {
        const response = await axios.put(
          `${config.API_URL}/appointments/${selectedWaitlistItem.appointment_id}/remarks`, // API endpoint
          { remarks, vitalSigns, diagnosis }, // Request payload
          {
            headers: {
              "Content-Type": "application/json", // Content-Type header for JSON data
            },
          }
        );

        if (response.status === 200) {
          // Update the state with the new remarks
          setWaitlistData((prevData) =>
            prevData.map((item) =>
              item.appointment_id === selectedWaitlistItem.appointment_id
                ? { ...item, remarks }
                : item
            )
          );
          handleCloseRemarksDialog();
        } else {
          throw new Error(response.data.error || "Failed to update remarks");
        }
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const formatDate = (dateString) => {
    return moment(dateString).format("MMMM D, YYYY");
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

  if (!waitlistData || waitlistData.length === 0) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <Typography variant="h6">No waitlist data available</Typography>
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
        <Table sx={{ minWidth: 650 }} aria-label="waitlist table">
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
            {waitlistData.map((waitlistItem) => (
              <TableRow
                key={waitlistItem.appointment_id}
                sx={{
                  "&:hover": {
                    backgroundColor: "#f5f5f5",
                  },
                }}
              >
                <TableCell>{waitlistItem.user_name}</TableCell>
                <TableCell>{waitlistItem.doctor_name}</TableCell>
                <TableCell>{waitlistItem.queue_status}</TableCell>
                <TableCell>{waitlistItem.purpose_of_appointment}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleViewDetails(waitlistItem)}
                    sx={{ marginRight: 1 }}
                  >
                    <Visibility />
                  </IconButton>

                  {/* Add/Edit Remarks Button */}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Details Dialog */}
      <Dialog
        open={openDetailsDialog}
        onClose={handleCloseDetailsDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Waitlist Item Details</DialogTitle>
        <DialogContent>
          {selectedWaitlistItem && (
            <Box>
              <Typography variant="h6" sx={{ marginBottom: 1 }}>
                <strong>Appointment Details</strong>
              </Typography>
              <Typography variant="body1">
                <strong>Appointment ID:</strong>{" "}
                {selectedWaitlistItem.appointment_id}
              </Typography>
              <Typography variant="body1">
                <strong>Status:</strong> {selectedWaitlistItem.queue_status}
              </Typography>
              <Typography variant="body1">
                <strong>Appointment Time:</strong>{" "}
                {formatDate(selectedWaitlistItem.appointment_time)}
              </Typography>
              <Typography variant="body1">
                <strong>Purpose of Appointment:</strong>{" "}
                {selectedWaitlistItem.purpose_of_appointment}
              </Typography>

              <Box mt={2}>
                <Typography variant="h6" sx={{ marginBottom: 1 }}>
                  <strong>User Details</strong>
                </Typography>
                <Typography variant="body1">
                  <strong>User Name:</strong> {selectedWaitlistItem.user_name}
                </Typography>
                <Typography variant="body1">
                  <strong>User Email:</strong> {selectedWaitlistItem.user_email}
                </Typography>
              </Box>

              <Box mt={2}>
                <Typography variant="h6" sx={{ marginBottom: 1 }}>
                  <strong>Doctor Details</strong>
                </Typography>
                <Typography variant="body1">
                  <strong>Doctor Name:</strong>{" "}
                  {selectedWaitlistItem.doctor_name}
                </Typography>
                <Typography variant="body1">
                  <strong>Doctor Email:</strong>{" "}
                  {selectedWaitlistItem.doctor_email}
                </Typography>
              </Box>

              {/* Medical Information */}
              <Box mt={2}>
                <Typography variant="h6" sx={{ marginBottom: 1 }}>
                  <strong>Medical Information</strong>
                </Typography>

                {/* Vital Signs */}
                <Box mt={2}>
                  <Typography variant="subtitle1">
                    <strong>Vital Signs:</strong>
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
                </Box>

                {/* Prescription */}
                <Box mt={2}>
                  <Typography variant="subtitle1">
                    <strong>Prescription:</strong>
                  </Typography>
                  <Typography variant="body1">
                    {patientDetails?.prescription || "No prescription recorded"}
                  </Typography>
                </Box>

                {/* Diagnosis */}
                <Box mt={2}>
                  <Typography variant="subtitle1">
                    <strong>Diagnosis:</strong>
                  </Typography>
                  <Typography variant="body1">
                    {patientDetails?.diagnosis || "No diagnosis recorded"}
                  </Typography>
                </Box>

                {/* Remarks */}
                <Box mt={2}>
                  <Typography variant="subtitle1">
                    <strong>Remarks:</strong>
                  </Typography>
                  <Typography variant="body1">
                    {patientDetails?.remarks || "No remarks recorded"}
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>

        <DialogActions
          sx={{
            display: "flex",
            justifyContent: "space-between",
            padding: "1rem",
          }}
        >
          {/* Mark as Done Button */}
          {selectedWaitlistItem &&
          selectedWaitlistItem.queue_status !== "Done" ? (
            <Button
              variant="contained"
              color="success"
              onClick={handleOpenRemarksDialog}
              sx={{
                textTransform: "none",
                fontWeight: "bold",
                fontSize: "0.9rem",
                padding: "0.5rem 1.5rem",
              }}
            >
              ✅ Mark as Done
            </Button>
          ) : null}

          {/* Edit/Add Medical Information */}
          <Button
            variant="outlined"
            color="info"
            onClick={() => setOpenRemarksDialog(true)}
            size="medium"
            sx={{
              textTransform: "none",
              fontWeight: "medium",
              fontSize: "0.9rem",
              padding: "0.4rem 1.5rem",
            }}
            startIcon={<EditNotifications />}
          >
            Edit/Add Medical Info
          </Button>

          {/* Close Button */}
          <Button
            onClick={handleCloseDetailsDialog}
            variant="text"
            color="error"
            sx={{
              textTransform: "none",
              fontWeight: "medium",
              fontSize: "0.9rem",
              padding: "0.4rem 1rem",
            }}
            startIcon={<CloseRounded />}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Remarks Dialog */}
      <Dialog
        open={openRemarksDialog}
        onClose={handleCloseRemarksDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h6">Remarks</Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Enter remarks here..."
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6">Vital Signs</Typography>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Height (cm)"
                value={vitalSigns.height}
                onChange={(e) =>
                  setVitalSigns({ ...vitalSigns, height: e.target.value })
                }
                variant="outlined"
                margin="normal"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Weight (kg)"
                value={vitalSigns.weight}
                onChange={(e) =>
                  setVitalSigns({ ...vitalSigns, weight: e.target.value })
                }
                variant="outlined"
                margin="normal"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Blood Pressure"
                value={vitalSigns.bp}
                onChange={(e) =>
                  setVitalSigns({ ...vitalSigns, bp: e.target.value })
                }
                variant="outlined"
                margin="normal"
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth variant="outlined" margin="normal">
                <InputLabel>Blood Type</InputLabel>
                <Select
                  value={vitalSigns.blood_type}
                  onChange={(e) =>
                    setVitalSigns({ ...vitalSigns, blood_type: e.target.value })
                  }
                  label="Blood Type"
                >
                  <MenuItem value="A+">A+</MenuItem>
                  <MenuItem value="A-">A-</MenuItem>
                  <MenuItem value="B+">B+</MenuItem>
                  <MenuItem value="B-">B-</MenuItem>
                  <MenuItem value="AB+">AB+</MenuItem>
                  <MenuItem value="AB-">AB-</MenuItem>
                  <MenuItem value="O+">O+</MenuItem>
                  <MenuItem value="O-">O-</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Prescription"
                value={vitalSigns.prescription}
                onChange={(e) =>
                  setVitalSigns({ ...vitalSigns, prescription: e.target.value })
                }
                variant="outlined"
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6">Diagnosis</Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Diagnosis"
                value={diagnosis.diagnosisText}
                onChange={(e) =>
                  setDiagnosis({ ...diagnosis, diagnosisText: e.target.value })
                }
                variant="outlined"
                margin="normal"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRemarksDialog} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleRemarksSubmit}
            color="primary"
            variant="contained"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}

export default Waitlist;
