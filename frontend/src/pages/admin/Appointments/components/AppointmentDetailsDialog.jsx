import { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Box,
  Typography,
  Button,
  Avatar,
  Divider,
  Grid,
} from "@mui/material";
import { Email, Home, Phone, Event, CheckCircle } from "@mui/icons-material";
import { FaPersonCircleQuestion } from "react-icons/fa6";
import PropTypes from "prop-types";
import config from "../../../../config/config";

const AppointmentDetailsDialog = ({
  open,
  onClose,
  appointment,
}) => {

  const [additionalInfo, setAdditionalInfo] = useState(null);
  const [loadingInfo, setLoadingInfo] = useState(false);

  // Reset state whenever a new appointment is opened
  useEffect(() => {
    if (open) {
      setAdditionalInfo(null);
    }
  }, [open, appointment]);

  const handleCloseDialog = () => {
    setAdditionalInfo(null); // Reset additional info on dialog close
    onClose();
  };

  const fetchAdditionalInfo = async () => {
    try {
      setLoadingInfo(true);
      setAdditionalInfo(null); // Clear previous info before fetching new data

      const endpoint =
        appointment.purpose_of_appointment.toLowerCase() === "immunization"
          ? `${config.API_URL}/immunization-info/${appointment.user_id}`
          : `${config.API_URL}/prenatal-info/${appointment.user_id}`;

      const response = await fetch(endpoint);
      if (response.ok) {
        const data = await response.json();
        setAdditionalInfo(data);
      } else {
        console.error("Error fetching additional information");
      }
    } catch (error) {
      console.error("Error fetching additional information:", error);
    } finally {
      setLoadingInfo(false);
    }
  };

  if (!appointment) {
    return null;
  }

  return (
    <Dialog
      open={open}
      onClose={handleCloseDialog}
      aria-labelledby="appointment-details-dialog"
    >
      <DialogTitle
        align="center"
        sx={{ fontWeight: "bold", fontSize: "1.5rem" }}
      >
        Appointment Details
      </DialogTitle>
      <DialogContent sx={{ backgroundColor: "#f7f7f7" }}>
        <Box
          sx={{
            padding: 3,
            backgroundColor: "white",
            borderRadius: 3,
            boxShadow: 3,
            mt: 2,
          }}
        >
          <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
            <Avatar
              sx={{
                width: 120,
                height: 120,
                fontSize: 50,
                backgroundColor: "#3f51b5",
                marginBottom: 2,
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
              }}
              src={`${config.API_URL}/profile_pictures/${appointment.avatar}`}
            />
            <Typography
              variant="h5"
              color="primary"
              align="center"
              sx={{ fontWeight: "bold" }}
            >
              {appointment.user_name}
            </Typography>
          </Box>

          <Divider sx={{ marginBottom: 2 }} />

          <Typography
            variant="subtitle1"
            sx={{ fontWeight: "bold", marginBottom: 2 }}
          >
            Appointment Details
          </Typography>

          {/* User Details */}
          <Grid container alignItems="center" spacing={2} mb={2}>
            <Grid item>
              <Email sx={{ color: "#3f51b5" }} />
            </Grid>
            <Grid item xs>
              <Typography>{appointment.user_email}</Typography>
            </Grid>
          </Grid>
          <Grid container alignItems="center" spacing={2} mb={2}>
            <Grid item>
              <Home sx={{ color: "#3f51b5" }} />
            </Grid>
            <Grid item xs>
              <Typography>{appointment.address}</Typography>
            </Grid>
          </Grid>
          <Grid container alignItems="center" spacing={2} mb={2}>
            <Grid item>
              <Phone sx={{ color: "#3f51b5" }} />
            </Grid>
            <Grid item xs>
              <Typography>{appointment.phone_number}</Typography>
            </Grid>
          </Grid>
          <Grid container alignItems="center" spacing={2} mb={2}>
            <Grid item>
              <FaPersonCircleQuestion
                style={{ fontSize: "25px", color: "#3f51b5" }}
              />
            </Grid>
            <Grid item xs>
              <Typography>
                Purpose: {appointment.purpose_of_appointment}
              </Typography>
            </Grid>
          </Grid>
          <Grid container alignItems="center" spacing={2} mb={2}>
            <Grid item>
              <Event sx={{ color: "#3f51b5" }} />
            </Grid>
            <Grid item xs>
              <Typography>
                Appointment Time:{" "}
                {new Date(appointment.appointment_time).toLocaleString(
                  "en-US",
                  {
                    weekday: "long", // Full name of the day
                    month: "long", // Full name of the month
                    day: "numeric", // Day of the month
                    year: "numeric", // Full year
                  }
                )}
              </Typography>
            </Grid>
          </Grid>
          <Grid container alignItems="center" spacing={2} mb={2}>
            <Grid item>
              <CheckCircle sx={{ color: "#3f51b5" }} />
            </Grid>
            <Grid item xs>
              <Typography>Status: {appointment.status}</Typography>
            </Grid>
          </Grid>

          {/* Additional Info */}
          <Button
            onClick={fetchAdditionalInfo}
            variant="contained"
            color="primary"
            sx={{ width: "100%", fontWeight: "bold", mt: 3 }}
          >
            Show {appointment.purpose_of_appointment} Information
          </Button>

          {loadingInfo ? (
            <Typography
              variant="body1"
              color="textSecondary"
              align="center"
              sx={{ mt: 2 }}
            >
              Loading additional information...
            </Typography>
          ) : additionalInfo ? (
            <Box mt={2}>
              {appointment.purpose_of_appointment.toLowerCase() ===
              "immunization" ? (
                <>
                  <Typography variant="h6" color="primary">
                    Immunization Details
                  </Typography>
                  <Typography>
                    Child Name: {additionalInfo.child_name}
                  </Typography>
                  <Typography>Birthdate: {additionalInfo.birthdate}</Typography>
                  <Typography>
                    Birthplace: {additionalInfo.birthplace}
                  </Typography>
                  <Typography>Address: {additionalInfo.address}</Typography>
                  <Typography>
                    Health Center: {additionalInfo.health_center}
                  </Typography>
                  <Typography>
                    Mother&apos;s Name: {additionalInfo.mother_name}
                  </Typography>
                  <Typography>
                    Father&apos;s Name: {additionalInfo.father_name}
                  </Typography>
                </>
              ) : (
                <>
                  <Typography variant="h6" color="primary">
                    Prenatal Details
                  </Typography>
                  <Typography>
                    Mother&apos;s Name: {additionalInfo.name}
                  </Typography>
                  <Typography>Age: {additionalInfo.age}</Typography>
                  <Typography>Address: {additionalInfo.address}</Typography>
                  <Typography>
                    Husband&apos;s Name: {additionalInfo.husband_name}
                  </Typography>
                  <Typography>
                    Husband&apos;s Age: {additionalInfo.husband_age}
                  </Typography>
                </>
              )}
            </Box>
          ) : null}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDialog} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

AppointmentDetailsDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  appointment: PropTypes.object,
  fetchAppointments: PropTypes.func.isRequired,
};

export default AppointmentDetailsDialog;
