// ImmunizationFields.js
import { TextField, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import PropTypes from "prop-types";

const ImmunizationFields = ({ formData, handleInputChange }) => (
  <>
    <TextField
      label="Child Name"
      value={formData.child_name || ""}
      onChange={(e) => handleInputChange("child_name", e.target.value)}
      fullWidth
      margin="normal"
    />
    <TextField
      label="Birthdate"
      type="date"
      value={formData.birthdate || ""}
      onChange={(e) => handleInputChange("birthdate", e.target.value)}
      fullWidth
      margin="normal"
      InputLabelProps={{ shrink: true }}
    />
    <TextField
      label="Birthplace"
      value={formData.birthplace || ""}
      onChange={(e) => handleInputChange("birthplace", e.target.value)}
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
      label="Mother's Name"
      value={formData.mother_name || ""}
      onChange={(e) => handleInputChange("mother_name", e.target.value)}
      fullWidth
      margin="normal"
    />
    <TextField
      label="Father's Name"
      value={formData.father_name || ""}
      onChange={(e) => handleInputChange("father_name", e.target.value)}
      fullWidth
      margin="normal"
    />
    <TextField
      label="Birth Height"
      value={formData.birth_height || ""}
      onChange={(e) => handleInputChange("birth_height", e.target.value)}
      fullWidth
      margin="normal"
    />
    <TextField
      label="Birth Weight"
      value={formData.birth_weight || ""}
      onChange={(e) => handleInputChange("birth_weight", e.target.value)}
      fullWidth
      margin="normal"
    />
    <FormControl fullWidth margin="normal">
      <InputLabel>Sex</InputLabel>
      <Select
        value={formData.sex || ""}
        onChange={(e) => handleInputChange("sex", e.target.value)}
      >
        <MenuItem value="male">Male</MenuItem>
        <MenuItem value="female">Female</MenuItem>
      </Select>
    </FormControl>
    <TextField
      label="Health Center"
      value={formData.health_center || ""}
      onChange={(e) => handleInputChange("health_center", e.target.value)}
      fullWidth
      margin="normal"
    />
    <TextField
      label="Barangay"
      value={formData.barangay || ""}
      onChange={(e) => handleInputChange("barangay", e.target.value)}
      fullWidth
      margin="normal"
    />
    <TextField
      label="Family Number"
      value={formData.family_number || ""}
      onChange={(e) => handleInputChange("family_number", e.target.value)}
      fullWidth
      margin="normal"
    />
  </>
);

ImmunizationFields.propTypes = {
  formData: PropTypes.shape({
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
  }).isRequired,
  handleInputChange: PropTypes.func.isRequired,
};

export default ImmunizationFields;
