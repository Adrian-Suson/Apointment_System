// FillUpForm.js
import PropTypes from "prop-types";
import { Box, Typography } from "@mui/material";
import ImmunizationFields from "./ImmunizationFields";
import PrenatalFields from "./PrenatalFields";

const FillUpForm = ({ formData, handleInputChange, purpose }) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {purpose === "Immunization"
          ? "Fill Immunization Information"
          : "Fill Prenatal Information"}
      </Typography>
      {purpose === "Immunization" && (
        <ImmunizationFields
          formData={formData}
          handleInputChange={handleInputChange}
        />
      )}
      {purpose === "Prenatal" && (
        <PrenatalFields
          formData={formData}
          handleInputChange={handleInputChange}
        />
      )}
    </Box>
  );
};

FillUpForm.propTypes = {
  formData: PropTypes.object.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  purpose: PropTypes.string.isRequired,
};

export default FillUpForm;
