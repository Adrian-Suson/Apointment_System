import { useCallback, useEffect, useState } from "react";
import {
  TextField,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
  Alert,
  Grid,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import config from "../../../config/config";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // Import calendar styles
import moment from "moment";

function Schedules() {
  const [schedules, setSchedules] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [doctorId, setDoctorId] = useState("");
  const [scheduleTime, setScheduleTime] = useState(new Date());
  const [amMaxPatients, setAmMaxPatients] = useState(0);
  const [pmMaxPatients, setPmMaxPatients] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const doctorData = JSON.parse(localStorage.getItem("doctorData"));
    if (doctorData && doctorData.id) {
      setDoctorId(doctorData.id);
    }
  }, []);

  const fetchSchedules = useCallback(async () => {
    const url = `${config.API_URL}/schedules/doctor/${doctorId}`;
    try {
      const response = await axios.get(url);
      if (Array.isArray(response.data)) {
        setSchedules(response.data);
        console.log("response.data:", response.data);
      } else {
        setSchedules([]);
      }
    } catch (error) {
      console.error("Error fetching schedules:", error);
      setSchedules([]);
    }
  }, [doctorId]);

  const checkExistingSchedule = async (scheduleDate) => {
    const formattedScheduleTime = moment(scheduleDate).format("YYYY-MM-DD");
    const url = `${config.API_URL}/schedules/doctor/${doctorId}?date=${formattedScheduleTime}`;

    try {
      const response = await axios.get(url);
      if (response.data && response.data.message) {
        // If a schedule exists for this date
        return true; // Schedule already exists
      }
      return false; // No schedule exists for this date
    } catch (error) {
      console.error("Error checking existing schedule:", error);
      return false; // Consider it as no existing schedule in case of error
    }
  };

  const handleOpen = (schedule = null) => {
    setErrorMessage("");
    if (schedule) {
      setEditingSchedule(schedule);
      setDoctorId(schedule.doctor_id);
      setScheduleTime(new Date(schedule.schedule_date));
      setAmMaxPatients(schedule.am_max_patients || 0);
      setPmMaxPatients(schedule.pm_max_patients || 0);
    } else {
      setEditingSchedule(null);
      setScheduleTime(new Date());
      setAmMaxPatients(0);
      setPmMaxPatients(0);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingSchedule(null);
    setDoctorId("");
    setScheduleTime(new Date());
    setAmMaxPatients(0);
    setPmMaxPatients(0);
    setErrorMessage("");
  };

  const handleSubmit = async () => {
    const formattedScheduleTime = moment(scheduleTime).format("YYYY-MM-DD");

    // Check if a schedule already exists for the doctor on the selected date
    const isScheduleExisting = await checkExistingSchedule(
      formattedScheduleTime
    );
    if (isScheduleExisting) {
      setErrorMessage("A schedule already exists for this date.");
      return;
    }

    // Ensure that am_max_patients and pm_max_patients are numbers
    const amMaxPatientsInt = Number(amMaxPatients);
    const pmMaxPatientsInt = Number(pmMaxPatients);

    // Validate if they are valid numbers
    if (isNaN(amMaxPatientsInt) || isNaN(pmMaxPatientsInt)) {
      setErrorMessage("AM and PM Max Patients must be valid numbers.");
      return;
    }

    const payload = {
      doctor_id: Number(doctorId), // Ensure doctorId is a number
      schedule_date: formattedScheduleTime,
      am_max_patients:
        Number(amMaxPatientsInt) >= 0 ? Number(amMaxPatientsInt) : 0,
      pm_max_patients:
        Number(pmMaxPatientsInt) >= 0 ? Number(pmMaxPatientsInt) : 0,
    };

    console.log("Payload being sent to the server:", payload); // Log payload

    try {
      if (editingSchedule) {
        await axios.put(
          `${config.API_URL}/schedules/${editingSchedule.id}`,
          payload
        );
      } else {
        await axios.post(`${config.API_URL}/schedules`, payload);
      }
      fetchSchedules();
      handleClose();
    } catch (error) {
      if (error.response && error.response.data) {
        setErrorMessage("Schedule already exists for this date.");
      } else {
        setErrorMessage("An error occurred while saving the schedule.");
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this schedule?")) {
      try {
        await axios.delete(`${config.API_URL}/schedules/${id}`);
        fetchSchedules();
      } catch (error) {
        console.error("Error deleting schedule:", error);
      }
    }
  };

  useEffect(() => {
    if (doctorId) {
      fetchSchedules();
    }
  }, [doctorId, fetchSchedules]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Schedules
      </Typography>
      <Button variant="contained" color="primary" onClick={() => handleOpen()}>
        Add Schedule
      </Button>
      <TableContainer component={Paper} sx={{ mt: 3, borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f4f4f4" }}>
              <TableCell>
                <strong>Name</strong>
              </TableCell>
              <TableCell>
                <strong>Email</strong>
              </TableCell>
              <TableCell>
                <strong>Specialization</strong>
              </TableCell>
              <TableCell>
                <strong>Date</strong>
              </TableCell>
              <TableCell>
                <strong>AM Max Patients</strong>
              </TableCell>
              <TableCell>
                <strong>PM Max Patients</strong>
              </TableCell>
              <TableCell>
                <strong>Actions</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {schedules.map((schedule, index) => (
              <TableRow
                key={`${schedule.id}-${index}`}
                sx={{
                  backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#fff",
                  "&:hover": {
                    backgroundColor: "#f1f1f1",
                  },
                }}
              >
                <TableCell>{schedule.doctor_name}</TableCell>
                <TableCell>{schedule.doctor_email}</TableCell>
                <TableCell>{schedule.doctor_specialization}</TableCell>
                <TableCell>
                  {new Date(schedule.schedule_date).toLocaleDateString(
                    "en-US",
                    {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </TableCell>
                <TableCell>{schedule.am_max_patients}</TableCell>
                <TableCell>{schedule.pm_max_patients}</TableCell>
                <TableCell>
                  <Tooltip title="Edit Schedule">
                    <IconButton
                      color="primary"
                      onClick={() => handleOpen(schedule)}
                    >
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete Schedule">
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(schedule.id)}
                    >
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {editingSchedule ? "Edit Schedule" : "Add Schedule"}
        </DialogTitle>
        <DialogContent>
          {errorMessage && (
            <Alert severity="error" sx={{ mb: 2, fontSize: "1rem" }}>
              {errorMessage}
            </Alert>
          )}
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="body1" gutterBottom>
                Schedule Date
              </Typography>
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Calendar
                  value={scheduleTime}
                  onChange={(date) => setScheduleTime(new Date(date))}
                  minDate={
                    new Date(new Date().setDate(new Date().getDate() + 1))
                  }
                  tileDisabled={({ date }) =>
                    date < new Date(new Date().setDate(new Date().getDate()))
                  }
                />
              </Box>
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="AM Max Patients"
                type="number"
                fullWidth
                value={amMaxPatients}
                onChange={(e) => setAmMaxPatients(e.target.value)}
                inputProps={{ min: 0 }}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="PM Max Patients"
                type="number"
                fullWidth
                value={pmMaxPatients}
                onChange={(e) => setPmMaxPatients(e.target.value)}
                inputProps={{ min: 0 }}
                required
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            {editingSchedule ? "Save Changes" : "Add Schedule"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Schedules;
