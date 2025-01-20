import { Box, Typography } from "@mui/material";
import PropTypes from "prop-types";

const AppointmentConfirmation = ({
  selectedDoctor,
  selectedDate,
  formData,
  purpose,
}) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Confirm Appointment Details
      </Typography>
      <Box mt={2}>
        <Typography variant="body1">
          <strong>Doctor:</strong> Dr. {selectedDoctor.name}
        </Typography>
        <Typography variant="body1">
          <strong>Date:</strong> {selectedDate || "None"}
        </Typography>
        <Typography variant="body1">
          <strong>Purpose:</strong> {purpose || "None"}
        </Typography>

        {/* Conditional rendering based on purpose */}
        {purpose === "Immunization" ? (
          <>
            <Typography variant="h6" gutterBottom mt={2}>
              Child Information
            </Typography>
            <Typography variant="body1">
              <strong>Child Name:</strong> {formData.child_name || "N/A"}
            </Typography>
            <Typography variant="body1">
              <strong>Birthdate:</strong> {formData.birthdate || "N/A"}
            </Typography>
            <Typography variant="body1">
              <strong>Birthplace:</strong> {formData.birthplace || "N/A"}
            </Typography>
            <Typography variant="body1">
              <strong>Address:</strong> {formData.address || "N/A"}
            </Typography>
            <Typography variant="body1">
              <strong>Mother&apos;s Name:</strong>{" "}
              {formData.mother_name || "N/A"}
            </Typography>
            <Typography variant="body1">
              <strong>Father&apos;s Name:</strong>{" "}
              {formData.father_name || "N/A"}
            </Typography>
            <Typography variant="body1">
              <strong>Birth Height:</strong> {formData.birth_height || "N/A"}
            </Typography>
            <Typography variant="body1">
              <strong>Birth Weight:</strong> {formData.birth_weight || "N/A"}
            </Typography>
            <Typography variant="body1">
              <strong>Sex:</strong> {formData.sex || "N/A"}
            </Typography>
            <Typography variant="body1">
              <strong>Health Center:</strong> {formData.health_center || "N/A"}
            </Typography>
            <Typography variant="body1">
              <strong>Barangay:</strong> {formData.barangay || "N/A"}
            </Typography>
            <Typography variant="body1">
              <strong>Family Number:</strong> {formData.family_number || "N/A"}
            </Typography>
          </>
        ) : purpose === "Prenatal" ? (
          <>
            <Typography variant="h6" gutterBottom mt={2}>
              Prenatal Information
            </Typography>
            <Typography variant="body1">
              <strong>Name:</strong> {formData.name || "N/A"}
            </Typography>
            <Typography variant="body1">
              <strong>Age:</strong> {formData.age || "N/A"}
            </Typography>
            <Typography variant="body1">
              <strong>Address:</strong> {formData.address || "N/A"}
            </Typography>
            <Typography variant="body1">
              <strong>Occupation:</strong> {formData.occupation || "N/A"}
            </Typography>
            <Typography variant="body1">
              <strong>Husband&apos;s Name:</strong>{" "}
              {formData.husband_name || "N/A"}
            </Typography>
            <Typography variant="body1">
              <strong>Husband&apos;s Age:</strong>{" "}
              {formData.husband_age || "N/A"}
            </Typography>
          </>
        ) : (
          <Typography variant="body1">
            No additional information provided.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

// Define PropTypes
AppointmentConfirmation.propTypes = {
  selectedDoctor: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }).isRequired,
  selectedDate: PropTypes.string.isRequired,
  purpose: PropTypes.string.isRequired,
  formData: PropTypes.shape({
    // Immunization fields
    child_name: PropTypes.string,
    birthdate: PropTypes.string,
    birthplace: PropTypes.string,
    address: PropTypes.string,
    mother_name: PropTypes.string,
    father_name: PropTypes.string,
    birth_height: PropTypes.string,
    birth_weight: PropTypes.string,
    sex: PropTypes.string,
    health_center: PropTypes.string,
    barangay: PropTypes.string,
    family_number: PropTypes.string,

    // Prenatal fields
    name: PropTypes.string,
    age: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    occupation: PropTypes.string,
    husband_name: PropTypes.string,
    husband_age: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }).isRequired,
};

export default AppointmentConfirmation;
