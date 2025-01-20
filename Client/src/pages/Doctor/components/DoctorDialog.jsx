// src/components/doctor/DoctorDialog.js
import {
  Dialog,
  DialogContent,
  Box,
  Avatar,
  Typography,
  Divider,
  Button,
} from "@mui/material";
import { BsPersonCircle } from "react-icons/bs";
import { AiOutlineClose, AiOutlineCalendar } from "react-icons/ai"; // Import close and calendar icons
import { MdEmail, MdPhone, MdLocationOn, MdCake } from "react-icons/md"; // Import icons for email, phone, address, birthdate
import PropTypes from "prop-types"; // Import PropTypes
import config from "../../../config/config";

const DoctorDialog = ({
  selectedDoctor,
  handleCloseDialog,
  handleRequestAppointment,
}) => {
  // Format birthdate to "Month Day, Year" format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  return (
    <Dialog
      open={Boolean(selectedDoctor)}
      onClose={handleCloseDialog}
      fullWidth
      maxWidth="sm" // Limit the dialog width on larger screens
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: { xs: 2, sm: 3 }, // Adjust padding based on screen size
        }}
      >
        <Avatar
          src={`${config.API_URL}/profile_pictures/${selectedDoctor.avatar}` || ""}
          alt={`${selectedDoctor.name}'s avatar`}
          sx={{
            width: 80,
            height: 80,
            marginBottom: 2,
          }}
        >
          <BsPersonCircle size={50} />
        </Avatar>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography
            variant="h5"
            sx={{ fontSize: { xs: "1.2rem", sm: "1.5rem" } }}
          >
            {selectedDoctor.name}
          </Typography>
        </Box>
        <Typography
          variant="subtitle1"
          color="black"
          sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
        >
          {selectedDoctor.specialization}
        </Typography>
      </Box>

      <Divider />

      <DialogContent>
        <Typography
          variant="subtitle1"
          color="black"
          sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
        >
          <strong>Details</strong>
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <MdEmail size={20} />
          <Typography sx={{ fontSize: { xs: "0.85rem", sm: "1rem" } }}>
            <strong>Email:</strong> {selectedDoctor.email}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <MdPhone size={20} />
          <Typography sx={{ fontSize: { xs: "0.85rem", sm: "1rem" } }}>
            <strong>Phone:</strong> {selectedDoctor.phone_number}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <MdCake size={20} />
          <Typography sx={{ fontSize: { xs: "0.85rem", sm: "1rem" } }}>
            <strong>Birthdate:</strong> {formatDate(selectedDoctor.birthdate)}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <MdLocationOn size={20} />
          <Typography sx={{ fontSize: { xs: "0.85rem", sm: "1rem" } }}>
            <strong>Address:</strong> {selectedDoctor.address}
          </Typography>
        </Box>

        {/* Buttons for closing and requesting an appointment */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" }, // Stack buttons vertically on small screens
            justifyContent: "space-between",
            marginTop: 2,
            gap: 2,
          }}
        >
          <Button
            onClick={handleRequestAppointment}
            variant="contained"
            color="primary"
            sx={{ width: { xs: "100%", sm: "auto" } }} // Full width on small screens
            startIcon={<AiOutlineCalendar />} // Appointment button icon
          >
            Request Appointment
          </Button>
          <Button
            onClick={handleCloseDialog}
            variant="outlined"
            color="secondary"
            sx={{ width: { xs: "100%", sm: "auto" } }} // Full width on small screens
            startIcon={<AiOutlineClose />} // Close button icon
          >
            Close
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

// Prop types validation
DoctorDialog.propTypes = {
  selectedDoctor: PropTypes.shape({
    avatar: PropTypes.string,
    name: PropTypes.string.isRequired,
    specialization: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    phone_number: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    birthdate: PropTypes.string.isRequired,
  }).isRequired,
  handleCloseDialog: PropTypes.func.isRequired,
  handleRequestAppointment: PropTypes.func.isRequired, // Added prop for the request appointment button
};

export default DoctorDialog;
