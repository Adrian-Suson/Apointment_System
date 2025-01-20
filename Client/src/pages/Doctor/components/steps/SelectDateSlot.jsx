import PropTypes from "prop-types";
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useEffect, useState } from "react";
import config from "../../../../config/config";
import moment from "moment"; // Import moment

const SelectDateSlot = ({
  selectedDate,
  setSelectedDate,
  purpose,
  setPurpose,
  doctorId,
  selectedSlot,
  setSelectedSlot,
}) => {
  const [availableSlots, setAvailableSlots] = useState({});

  // Fetch available slots from the backend
  useEffect(() => {
    const fetchAvailableSlots = async () => {
      try {
        const response = await fetch(
          `${config.API_URL}/available-slots?doctorId=${doctorId}`
        );
        const data = await response.json();
        console.log("Available Slots Data: ", data); // Check the data format here

        // Transform data into a more usable format using moment
        const slots = data.reduce((acc, slot) => {
          const dateKey = moment(slot.schedule_date).format("YYYY-MM-DD"); // Format the date using moment
          acc[dateKey] = {
            AM: { remainingSlots: slot.am.remaining_slots },
            PM: { remainingSlots: slot.pm.remaining_slots },
          };
          return acc;
        }, {});

        setAvailableSlots(slots);
      } catch (error) {
        console.error("Error fetching available slots", error);
      }
    };

    if (doctorId) {
      fetchAvailableSlots();
    }
  }, [doctorId]);

  // Disable dates with no available slots
  const isDateDisabled = (date) => {
    const dateKey = moment(date).format("YYYY-MM-DD"); // Format the date using moment
    return !availableSlots[dateKey];
  };

  // Render available slots on the calendar
  const renderTileContent = ({ date }) => {
    const dateKey = moment(date).format("YYYY-MM-DD"); // Format the date using moment
    const slots = availableSlots[dateKey]; // Get slots for the date

    if (slots) {
      return (
        <Box>
          {slots.AM.remainingSlots > 0 && (
            <Typography
              display="block"
              variant="caption"
              color="primary"
              sx={{
                backgroundColor: "rgba(0, 123, 255, 0.1)",
                padding: "4px 8px",
                borderRadius: "12px",
                fontWeight: "bold",
                textAlign: "center",
                fontSize: "0.75rem",
              }}
            >
              {slots.AM.remainingSlots} AM
            </Typography>
          )}
          {slots.PM.remainingSlots > 0 && (
            <Typography
              display="block"
              variant="caption"
              color="primary"
              sx={{
                backgroundColor: "rgba(0, 123, 255, 0.1)",
                padding: "4px 8px",
                borderRadius: "12px",
                fontWeight: "bold",
                textAlign: "center",
                fontSize: "0.75rem",
              }}
            >
              {slots.PM.remainingSlots} PM
            </Typography>
          )}
        </Box>
      );
    }
    return null;
  };

  // Handle AM/PM slot selection
  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Select Date & Slot
      </Typography>

      {/* Calendar component */}
      <Calendar
        onChange={setSelectedDate}
        value={selectedDate}
        tileContent={renderTileContent}
        tileDisabled={({ date }) => isDateDisabled(date)} // Disable dates with no available slots
        minDate={new Date()} // Prevent selecting past dates
        sx={{
          ".react-calendar__tile": {
            padding: "16px",
            fontSize: "1rem",
            width: "50px",
            height: "50px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          },
        }}
      />

      {/* Slot selection buttons */}
      <Box mt={3}>
        <Typography variant="subtitle1">Select Slot</Typography>
        <Box display="flex" gap={2}>
          <Button
            variant={selectedSlot === "AM" ? "contained" : "outlined"}
            color="primary"
            onClick={() => handleSlotSelect("AM")}
            disabled={
              !selectedDate ||
              !availableSlots[moment(selectedDate).format("YYYY-MM-DD")] ||
              !availableSlots[moment(selectedDate).format("YYYY-MM-DD")]?.AM
                ?.remainingSlots ||
              availableSlots[moment(selectedDate).format("YYYY-MM-DD")]?.AM
                ?.remainingSlots <= 0
            }
            sx={{
              "&.Mui-disabled": {
                backgroundColor: "#e0e0e0",
                color: "#9e9e9e",
              },
            }}
          >
            AM
          </Button>
          <Button
            variant={selectedSlot === "PM" ? "contained" : "outlined"}
            color="primary"
            onClick={() => handleSlotSelect("PM")}
            disabled={
              !selectedDate ||
              !availableSlots[moment(selectedDate).format("YYYY-MM-DD")] ||
              !availableSlots[moment(selectedDate).format("YYYY-MM-DD")]?.PM
                ?.remainingSlots ||
              availableSlots[moment(selectedDate).format("YYYY-MM-DD")]?.PM
                ?.remainingSlots <= 0
            }
            sx={{
              "&.Mui-disabled": {
                backgroundColor: "#e0e0e0",
                color: "#9e9e9e",
              },
            }}
          >
            PM
          </Button>
        </Box>
      </Box>

      {/* Purpose selection */}
      <Box mt={3}>
        <FormControl fullWidth>
          <InputLabel id="purpose-select-label">Purpose</InputLabel>
          <Select
            labelId="purpose-select-label"
            value={purpose}
            label="Purpose"
            onChange={(e) => setPurpose(e.target.value)}
          >
            <MenuItem value="Prenatal">Prenatal</MenuItem>
            <MenuItem value="Immunization">Immunization</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Display selected date */}
      <Typography variant="h6" gutterBottom mt={3}>
        Selected Date: {selectedDate?.toLocaleDateString() || "None"}
      </Typography>
    </Box>
  );
};

SelectDateSlot.propTypes = {
  selectedDate: PropTypes.instanceOf(Date),
  setSelectedDate: PropTypes.func.isRequired,
  purpose: PropTypes.string.isRequired,
  setPurpose: PropTypes.func.isRequired,
  doctorId: PropTypes.number.isRequired,
  selectedSlot: PropTypes.string,
  setSelectedSlot: PropTypes.func.isRequired,
};

export default SelectDateSlot;
