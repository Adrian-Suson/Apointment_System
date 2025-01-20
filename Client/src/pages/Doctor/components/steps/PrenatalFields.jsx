// PrenatalFields.js
import { TextField } from "@mui/material";
import PropTypes from "prop-types";

const PrenatalFields = ({ formData, handleInputChange }) => (
  <>
    <TextField
      label="Name"
      value={formData.name || ""}
      onChange={(e) => handleInputChange("name", e.target.value)}
      fullWidth
      margin="normal"
    />
    <TextField
      label="Age"
      type="number"
      value={formData.age || ""}
      onChange={(e) => handleInputChange("age", e.target.value)}
      fullWidth
      margin="normal"
    />
    <TextField
      label="Address"
      value={formData.address || ""}
      onChange={(e) => handleInputChange("address", e.target.value)}
      fullWidth
      margin="normal"
    />
    <TextField
      label="Occupation"
      value={formData.occupation || ""}
      onChange={(e) => handleInputChange("occupation", e.target.value)}
      fullWidth
      margin="normal"
    />
    <TextField
      label="Husband's Name"
      value={formData.husband_name || ""}
      onChange={(e) => handleInputChange("husband_name", e.target.value)}
      fullWidth
      margin="normal"
    />
    <TextField
      label="Husband's Age"
      type="number"
      value={formData.husband_age || ""}
      onChange={(e) => handleInputChange("husband_age", e.target.value)}
      fullWidth
      margin="normal"
    />
  </>
);

PrenatalFields.propTypes = {
  formData: PropTypes.shape({
    name: PropTypes.string,
    age: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    address: PropTypes.string,
    occupation: PropTypes.string,
    husband_name: PropTypes.string,
    husband_age: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }).isRequired,
  handleInputChange: PropTypes.func.isRequired,
};

export default PrenatalFields;
