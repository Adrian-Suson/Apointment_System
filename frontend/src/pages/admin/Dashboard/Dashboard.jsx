import {
  Box,
  Grid,
  Typography,
  CircularProgress,
  TableCell,
  TableBody,
  TableRow,
  TableHead,
  Table,
  TableContainer,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";
import moment from "moment";
import {
  People,
  LocalHospital,
  EventAvailable,
  Schedule,
  Visibility as VisibilityIcon, // Importing VisibilityIcon
} from "@mui/icons-material";
import { useState, useEffect } from "react";
import { ResponsiveLine } from "@nivo/line"; // Import Nivo Line Chart
import StatCard from "../../../components/StatCard"; // Import StatCard
import config from "../../../config/config";

const Dashboard = () => {
  const adminData = JSON.parse(localStorage.getItem("adminData"));
  const [queueData, setQueueData] = useState([]);
  const [loadingQueue, setLoadingQueue] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [patientDetails, setPatientDetails] = useState(null);
  const [stats, setStats] = useState({
    totalAppointments: 0,
    activeDoctors: 0,
    totalPatients: 0,
    pendingAppointments: 0,
  });
  const [openRemarksDialog, setOpenRemarksDialog] = useState(false);
  const [remarks, setRemarks] = useState("");

  useEffect(() => {
    // Fetch data for queue
    setLoadingQueue(true);
    fetch(`${config.API_URL}/queue`) // Replace with your API endpoint
      .then((res) => res.json())
      .then((data) => {
        setQueueData(data);
        setLoadingQueue(false);
      })
      .catch(() => setLoadingQueue(false));

    // Fetch stats
    fetch(`${config.API_URL}/allstats`)
      .then((res) => res.json())
      .then((data) => setStats(data));
  }, [adminData.id]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${config.API_URL}/weekly`);
        const response = await res.json();

        if (response.success) {
          console.log("Fetched chart data:", response.data);
          setChartData([response.data]);
        } else {
          console.warn("Invalid chart data format:", response);
        }
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };

    fetchData();
  }, []);

  const fetchPatientDetails = async (appointmentId) => {
    try {
      const response = await fetch(
        `${config.API_URL}/appointments/${appointmentId}/patient-details`
      );
      const data = await response.json();
      setPatientDetails(data);
    } catch (err) {
      console.error("Error fetching patient details:", err);
    }
  };

  const handleOpenRemarksDialog = async (queueItem) => {
    setRemarks(queueItem.remarks || "No remarks available");
    await fetchPatientDetails(queueItem.appointment_id);
    setOpenRemarksDialog(true);
  };

  const handleCloseRemarksDialog = () => {
    setOpenRemarksDialog(false);
    setRemarks(""); // Clear remarks when closing
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ fontSize: { xs: "1.5rem", sm: "2rem" } }}
      >
        Welcome, Admin
      </Typography>
      <Typography
        variant="subtitle1"
        color="text.secondary"
        mb={4}
        sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
      >
        Here&apos;s what&apos;s happening in the clinic today
      </Typography>

      {/* Stat Cards Section */}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Appointments"
            value={stats.totalAppointments}
            icon={<EventAvailable sx={{ fontSize: 30, color: "#0A2841" }} />}
            color="#0A2841"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Doctors"
            value={stats.activeDoctors}
            icon={<LocalHospital sx={{ fontSize: 30, color: "#1976d2" }} />}
            color="#1976d2"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Patients"
            value={stats.totalPatients}
            icon={<People sx={{ fontSize: 30, color: "#2e7d32" }} />}
            color="#2e7d32"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pending Appointments"
            value={stats.pendingAppointments}
            icon={<Schedule sx={{ fontSize: 30, color: "#ed6c02" }} />}
            color="#ed6c02"
          />
        </Grid>
      </Grid>

      {/* Table and Chart Side-by-Side Layout */}
      <Grid container spacing={2} mt={4}>
        {/* Queue Table */}
        <Grid item xs={12} md={6}>
          <Typography
            variant="h5"
            gutterBottom
            sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" } }}
          >
            Waitlist for Today
          </Typography>
          {loadingQueue ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              sx={{ height: "200px" }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer
              component={Paper}
              sx={{ marginTop: 2, maxHeight: 300, overflowX: "auto" }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: "black" }}>Patient Name</TableCell>
                    <TableCell sx={{ color: "black" }}>
                      Appointment Time
                    </TableCell>
                    <TableCell sx={{ color: "black" }}>Status</TableCell>
                    <TableCell sx={{ color: "black" }}>Remarks</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {queueData.map((queueItem) => (
                    <TableRow key={queueItem.queue_id}>
                      <TableCell sx={{ color: "black" }}>
                        {queueItem.user_name}
                      </TableCell>
                      <TableCell sx={{ color: "black" }}>
                        {moment(queueItem.appointment_time).format(
                          "dddd, MMMM Do YYYY"
                        )}
                      </TableCell>
                      <TableCell sx={{ color: "black" }}>
                        {queueItem.queue_status}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <VisibilityIcon
                            sx={{
                              fontSize: 25,
                              cursor: "pointer",
                              color: "primary.main",
                            }} // Set color using the theme's primary color
                            onClick={() => handleOpenRemarksDialog(queueItem)}
                          />
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Grid>

        {/* Line Chart */}
        <Grid item xs={12} md={6}>
          <Typography
            variant="h5"
            gutterBottom
            sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" } }}
          >
            Appointments Over Time
          </Typography>
          <Box sx={{ height: 300, mt: 2 }}>
            <Box
              sx={{
                backgroundColor: "#f9f9f9",
                borderRadius: "16px",
                padding: "16px",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                height: 300,
                mt: 2,
              }}
            >
              {chartData && chartData.length > 0 ? (
                <ResponsiveLine
                  data={chartData}
                  margin={{ top: 50, right: 60, bottom: 50, left: 60 }}
                  xScale={{ type: "point" }}
                  yScale={{
                    type: "linear",
                    min: "auto",
                    max: "auto",
                    stacked: false,
                    reverse: false,
                  }}
                  axisTop={null}
                  axisRight={null}
                  axisBottom={{
                    orient: "bottom",
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: "Day",
                    legendOffset: 36,
                    legendPosition: "middle",
                  }}
                  axisLeft={{
                    orient: "left",
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: "Appointments",
                    legendOffset: -40,
                    legendPosition: "middle",
                    tickValues: chartData[0]?.data?.length
                      ? Array.from(
                          {
                            length: Math.ceil(
                              Math.max(...chartData[0].data.map((d) => d.y)) + 1
                            ),
                          },
                          (_, i) => i
                        )
                      : [0],
                  }}
                  colors={{ scheme: "nivo" }}
                  pointSize={8}
                  pointColor={{ theme: "background" }}
                  pointBorderWidth={2}
                  pointBorderColor={{ from: "serieColor" }}
                  pointLabelYOffset={-12}
                  useMesh={true}
                  defs={[
                    {
                      id: "gradientBackground",
                      type: "linearGradient",
                      colors: [
                        { offset: 0, color: "#e3f2fd" },
                        { offset: 100, color: "#90caf9" },
                      ],
                    },
                  ]}
                  fill={[
                    { match: { id: "Appointments" }, id: "gradientBackground" },
                  ]}
                  theme={{
                    axis: {
                      ticks: {
                        text: {
                          fontSize: 12,
                          fill: "#555",
                        },
                      },
                    },
                  }}
                />
              ) : (
                <Typography variant="h6" color="text.secondary">
                  No data available for the chart.
                </Typography>
              )}
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* Remarks Dialog */}
      <Dialog
        open={openRemarksDialog}
        onClose={handleCloseRemarksDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Medical Information</DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            {/* Vital Signs */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                <strong>Vital Signs</strong>
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body1">
                    Height: {patientDetails?.height || "N/A"} cm
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1">
                    Weight: {patientDetails?.weight || "N/A"} kg
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1">
                    Blood Pressure: {patientDetails?.bp || "N/A"}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1">
                    Blood Type: {patientDetails?.blood_type || "N/A"}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>

            {/* Prescription */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                <strong>Prescription</strong>
              </Typography>
              <Typography variant="body1">
                {patientDetails?.prescription || "No prescription recorded"}
              </Typography>
            </Grid>

            {/* Diagnosis */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                <strong>Diagnosis</strong>
              </Typography>
              <Typography variant="body1">
                {patientDetails?.diagnosis || "No diagnosis recorded"}
              </Typography>
            </Grid>

            {/* Remarks */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                <strong>Remarks</strong>
              </Typography>
              <Typography variant="body1">
                {remarks || "No remarks recorded"}
              </Typography>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRemarksDialog} color="secondary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Dashboard;
