import { useState, useEffect } from "react";
import {
  Box,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  Divider,
} from "@mui/material";
import {
  Queue as QueueIcon,
  Event as AppointmentsIcon,
} from "@mui/icons-material";
import Waitlist from "./Waitlist"; // Import Waitlist Component
import Appointments from "./Appointments"; // Import Appointments Component

function WaitlistAndAppointments() {
  // On component mount, get the saved view from localStorage or default to "waitlist"
  const savedView = localStorage.getItem("view") || "waitlist";

  const [view, setView] = useState(savedView);

  // Save the current view to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("view", view);
  }, [view]);

  const handleViewChange = (event, newView) => {
    if (newView !== null) {
      setView(newView);
    }
  };

  return (
    <Box sx={{ padding: 4 }}>
      {/* Header */}
      <Typography variant="h4" sx={{ fontWeight: "bold", marginBottom: 3 }}>
        Manage Your Schedule
      </Typography>

      {/* Paper containing Toggle Button Group and Title in the same row */}
      <Paper
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          padding: 2,
          marginBottom: 3,
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        {/* Toggle Button Group aligned to the right */}
        <ToggleButtonGroup
          value={view}
          exclusive
          onChange={handleViewChange}
          aria-label="Waitlist and Appointments Toggle"
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            borderRadius: 2,
            boxShadow: 1,
          }}
        >
          <ToggleButton
            value="waitlist"
            aria-label="waitlist"
            sx={{
              display: "flex",
              alignItems: "center",
              padding: 1,
              fontSize: "0.875rem",
            }}
          >
            <QueueIcon sx={{ marginRight: 1 }} />
            Waitlist
          </ToggleButton>
          <ToggleButton
            value="appointments"
            aria-label="appointments"
            sx={{
              display: "flex",
              alignItems: "center",
              padding: 1,
              fontSize: "0.875rem",
            }}
          >
            <AppointmentsIcon sx={{ marginRight: 1 }} />
            Appointments
          </ToggleButton>
        </ToggleButtonGroup>

        {/* Title centered inside Paper */}
        <Box sx={{ flexGrow: 1, textAlign: "center", marginRight: 35 }}>
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            {view === "waitlist" ? "Waitlist" : "Appointments"}
          </Typography>
        </Box>
      </Paper>

      {/* Divider */}
      <Divider sx={{ marginBottom: 3 }} />

      {/* Render waitlist or Appointments based on the selected view */}
      {view === "waitlist" && (
        <Box>
          <Waitlist />
        </Box>
      )}

      {view === "appointments" && (
        <Box>
          <Appointments />
        </Box>
      )}
    </Box>
  );
}

export default WaitlistAndAppointments;
