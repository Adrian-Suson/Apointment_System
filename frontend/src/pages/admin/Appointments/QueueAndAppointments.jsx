import { useState } from "react";
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
import Queue from "./Queue"; // Import Queue Component
import Appointments from "./Appointments"; // Import Appointments Component

function QueueAndAppointments() {
  const [view, setView] = useState("Waitlist"); // Default to "queue" view

  const handleViewChange = (event, newView) => {
    if (newView !== null) {
      setView(newView);
    }
  };

  return (
    <Box sx={{ padding: 4 }}>
      {/* Header */}
      <Typography variant="h4" sx={{ fontWeight: "bold", marginBottom: 3 }}>
      Waitlist & Appointments
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
            justifyContent: "flex-end", // Align buttons to the right
            borderRadius: 2,
            boxShadow: 1,
          }}
        >
          <ToggleButton
            value="Waitlist"
            aria-label="Waitlist"
            sx={{
              display: "flex",
              alignItems: "center",
              padding: 1,
              fontSize: "0.875rem", // Smaller font size
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
              padding: 1, // Reduced padding for smaller buttons
              fontSize: "0.875rem", // Smaller font size
            }}
          >
            <AppointmentsIcon sx={{ marginRight: 1 }} />
            Appointments
          </ToggleButton>
        </ToggleButtonGroup>

        {/* Title centered inside Paper */}
        <Box sx={{ flexGrow: 1, textAlign: "center", marginRight: 35 }}>
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            {view === "Waitlist" ? "Waitlist" : "Appointments List"}
          </Typography>
        </Box>
      </Paper>

      {/* Divider */}
      <Divider sx={{ marginBottom: 3 }} />

      {/* Render Queue or Appointments based on the selected view */}
      {view === "Waitlist" && (
        <Box>
          <Queue />
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

export default QueueAndAppointments;
