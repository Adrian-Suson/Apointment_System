import { useState } from "react";
import {
  TextField,
  Button,
  Grid,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Paper,
  Avatar,
  IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import config from "../../../config/config";
import logo from "../../../assets/1736246305876.png"; // Adjust path according to your project structure

const DoctorLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // New state for password visibility

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post(`${config.API_URL}/doctor/login`, {
        email,
        password,
      });

      localStorage.setItem("token", response.data.token);
      const doctorData = {
        token: response.data.token,
        id: response.data.doctor.id,
        email: response.data.doctor.email,
        avatar: response.data.doctor.avatar,
        name: response.data.doctor.name,
        birthdate: response.data.doctor.birthdate,
        address: response.data.doctor.address,
        specialization_id: response.data.doctor.specialization_id,
        phone_number: response.data.doctor.phone_number,
        status: response.data.doctor.status,
      };

      localStorage.setItem("doctorData", JSON.stringify(doctorData));
      navigate("/doctor/dashboard");
    } catch (err) {
      setError("Invalid credentials or server error");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterRedirect = () => {
    navigate("/doctor/register");
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Paper sx={{ padding: 3 }}>
        {/* Logo Section */}
        <Box display="flex" justifyContent="center" mb={3}>
          <Avatar
            alt="Logo"
            src={logo} // Replace with your actual logo path
            sx={{ width: 150, height: 150 }}
          />
        </Box>

        <Typography
          display="flex"
          justifyContent="center"
          variant="h5"
          gutterBottom
          color="primary"
          sx={{ fontWeight: "bold" }}
        >
          Doctor Login
        </Typography>

        {error && (
          <Alert severity="error" sx={{ width: "100%", marginBottom: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <TextField
            label="Email"
            type="email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!error}
            helperText={error && "Please enter a valid email"}
            InputProps={{
              startAdornment: <EmailIcon sx={{ marginRight: 1 }} />,
            }}
          />
          <TextField
            label="Password"
            type={showPassword ? "text" : "password"} // Toggle between 'text' and 'password'
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!error}
            helperText={error && "Please enter your password"}
            InputProps={{
              startAdornment: <LockIcon sx={{ marginRight: 1 }} />,
              endAdornment: (
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => setShowPassword((prev) => !prev)} // Toggle visibility
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              ),
            }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
            sx={{ marginTop: 2, padding: 1.5 }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Log In"
            )}
          </Button>
        </form>

        <Grid container justifyContent="center" sx={{ marginTop: 2 }}>
          <Grid item>
            {" "}
            Don&apos;t have an account?
            <Button onClick={handleRegisterRedirect} color="primary">
              Register as a Doctor
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default DoctorLogin;
