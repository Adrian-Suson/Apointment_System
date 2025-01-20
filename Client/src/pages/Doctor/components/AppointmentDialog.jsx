import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
} from "@mui/material";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import "react-calendar/dist/Calendar.css";
import AppointmentSteps from "./steps/AppointmentSteps";
import SelectDateSlot from "./steps/SelectDateSlot";
import config from "../../../config/config";
import axios from "axios";
import moment from "moment";
import AppointmentConfirmation from "./steps/AppointmentConfirmation";
import FillUpForm from "./steps/fillupForm";

const AppointmentDialog = ({ selectedDoctor, handleClose }) => {
  const userId = localStorage.getItem("userId");
  const [activeStep, setActiveStep] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState(""); // AM/PM slot
  const [selectedDate, setSelectedDate] = useState(null); // Date of the appointment
  const [purpose, setPurpose] = useState("Prenatal"); // Default to "Prenatal"
  const [formData, setFormData] = useState({}); // Form data initialization

  const [error, setError] = useState("");
  const [availableSlots, setAvailableSlots] = useState({});
  const [loading, setLoading] = useState(true);
  const [scheduleId, setScheduleId] = useState(null); // Store scheduleId

  // Fetch schedules for selected doctor to get the schedule_id
  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await axios.get(
          `${config.API_URL}/schedules/doctor/${selectedDoctor.id}`
        );
        const schedules = response.data;

        if (schedules.length > 0) {
          // Assuming the first schedule is what you want to use for fetching available slots
          setScheduleId(schedules[0].schedule_id);
        } else {
          setError("No schedules found for this doctor.");
        }
      } catch (error) {
        console.error("Error fetching schedules:", error);
        setError("Could not load schedules.");
      }
    };

    if (selectedDoctor?.id) {
      fetchSchedules();
    }
  }, [selectedDoctor]);

  // Fetch available slots once scheduleId is available
  useEffect(() => {
    if (scheduleId) {
      const fetchAvailableSlots = async () => {
        try {
          const response = await axios.get(
            `${config.API_URL}/available-slots?doctorId=${selectedDoctor.id}&scheduleId=${scheduleId}`
          );
          const data = response.data;
          const transformedData = data.reduce((acc, slot) => {
            const dateKey = moment(slot.schedule_date).format("YYYY-MM-DD");
            acc[dateKey] = {
              am: slot.am.remaining_slots,
              pm: slot.pm.remaining_slots,
            };
            return acc;
          }, {});
          setAvailableSlots(transformedData);
        } catch (error) {
          console.error("Error fetching available slots:", error);
          setError("Could not load available slots.");
        } finally {
          setLoading(false);
        }
      };

      fetchAvailableSlots();
    }
  }, [scheduleId, selectedDoctor.id]);

  // Steps for the appointment process
  const steps = ["Select Date & Slot", "Fill Up Form", "Confirm Appointment"];

  const handleNext = () => {
    if (activeStep === 0) {
      if (!selectedDate) {
        setError("Please select a date.");
        return;
      }
      if (!selectedSlot) {
        setError("Please select a time slot.");
        return;
      }
    }
    if (activeStep === 1) {
      const requiredFields = Object.keys(formData);
      const missingField = requiredFields.find((field) => !formData[field]);
      if (missingField) {
        setError(`Please fill in the required field: ${missingField}`);
        return;
      }
    }
    setError("");
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setError("");
    setActiveStep((prev) => prev - 1);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!selectedDate || !selectedSlot) {
      setError("Please select both a date and a time slot.");
      return;
    }

    const formattedDate = moment(selectedDate).format("YYYY-MM-DD");

    const appointmentData = {
      userId,
      doctorId: selectedDoctor.id,
      selectedDate: formattedDate,
      slotPeriod: selectedSlot,
      purpose,
      formData,
    };
    console.log("appointmentData", appointmentData);

    try {
      const response = await axios.post(
        `${config.API_URL}/appointments`,
        appointmentData
      );

      if (response.status === 200 || response.status === 201) {
        console.log("Appointment booked successfully.");
        handleClose(); // Close dialog on successful booking
      } else {
        console.error("Failed to book appointment:", response.data);
        setError("Failed to book the appointment.");
      }
    } catch (error) {
      console.error("Error submitting appointment data:", error.message);
      setError("There was an error processing your request.");
    }
  };

  // Format the selected date outside the handleSubmit
  const formattedDate = selectedDate
    ? moment(selectedDate).format("YYYY-MM-DD")
    : "";

  if (loading) {
    return (
      <Dialog open={true} onClose={handleClose} fullScreen>
        <DialogTitle>Loading...</DialogTitle>
        <DialogContent>
          <Typography>Loading available slots. Please wait...</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <Dialog open={true} onClose={handleClose} fullScreen>
      <DialogTitle>
        Request Appointment with Dr. {selectedDoctor.name || "Sample Doctor"}
      </DialogTitle>
      <DialogContent>
        <AppointmentSteps activeStep={activeStep} steps={steps} />
        <Box mt={3}>
          {activeStep === 0 && (
            <SelectDateSlot
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              availableSlots={availableSlots}
              selectedSlot={selectedSlot}
              doctorId={selectedDoctor.id}
              setSelectedSlot={setSelectedSlot}
              purpose={purpose}
              setPurpose={setPurpose}
            />
          )}

          {activeStep === 1 && (
            <FillUpForm
              formData={formData}
              handleInputChange={handleInputChange}
              purpose={purpose}
            />
          )}

          {activeStep === 2 && (
            <AppointmentConfirmation
              selectedDoctor={selectedDoctor}
              selectedDate={formattedDate}
              purpose={purpose}
              formData={formData}
            />
          )}

          {error && (
            <Box color="error.main" mt={2}>
              <strong>{error}</strong>
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        {activeStep > 0 && (
          <Button onClick={handleBack} color="secondary">
            Back
          </Button>
        )}
        {activeStep < steps.length - 1 ? (
          <Button onClick={handleNext} color="primary">
            Next
          </Button>
        ) : (
          <Button onClick={handleSubmit} color="primary">
            Confirm
          </Button>
        )}
        <Button onClick={handleClose} color="secondary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

AppointmentDialog.propTypes = {
  selectedDoctor: PropTypes.object.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default AppointmentDialog;
