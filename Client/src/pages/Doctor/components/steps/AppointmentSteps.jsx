import PropTypes from "prop-types";
import { Step, StepLabel, Stepper } from "@mui/material";

const AppointmentSteps = ({ activeStep, steps }) => {
  return (
    <Stepper activeStep={activeStep} alternativeLabel>
      {steps.map((label) => (
        <Step key={label}>
          <StepLabel>{label}</StepLabel>
        </Step>
      ))}
    </Stepper>
  );
};

// Adding PropTypes
AppointmentSteps.propTypes = {
  activeStep: PropTypes.number.isRequired, // The current step index
  steps: PropTypes.arrayOf(PropTypes.string).isRequired, // Array of step labels
};

export default AppointmentSteps;
